import { renderHbs } from "./handlebarsUtil.js";
import get from "./lodash/get.js";
import isFunction from "./lodash/isFunction.js";
import isPlainObject from "./lodash/isPlainObject.js";
import remove from "./lodash/remove.js";
import { tooltipsStore, turnOnTooltip } from "./tooltipUtil.js";
import {
  HIDE_SELECTED,
  MAX_COUNT,
  MAX_REC_ITEMS,
  SEARCH_RESULTS,
  SEARCH_TERM,
  SETTINGS,
  addSpinner,
  getLocalStorgeData,
} from "./utils.js";

const parser = new DOMParser();

function descriptionToogle(event) {
  if (!event || !event.target) {
    return;
  }

  const card = event.target.closest(".card");
  if (!card) {
    return;
  }

  const synopsisEl = card.querySelector(".synopsis-value") || {};

  if ((synopsisEl.innerText || "").trim()) {
    synopsisEl.classList.toggle("line-сlamp");
  }
}

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearForm = document.getElementById("clearForm");
const hideSelectedToggle = document.getElementById("hideSelectedToggle");
const hideSelectedToggleInternal = document.getElementById(
  "hideSelectedToggleInternal"
);
const searchByRec = document.getElementById("searchByRec");
const recommendContainer = document.getElementById("recommend");
const resultContainer = document.getElementById("result");
const spinner = document.getElementById("spinner");
const loadMoreBtn = document.getElementById("loadMore");
const errorTooManySelectedBtn = document.getElementById(
  "errorTooManySelectedBtn"
);

searchForm.addEventListener("submit", searchCb);
clearForm.addEventListener("click", clearCb);
hideSelectedToggle.addEventListener("click", hideSelectedCb);
hideSelectedToggleInternal.addEventListener("click", hideSelectedCb);
searchByRec.addEventListener("click", searchByRecCb);
loadMoreBtn.addEventListener("click", loadMoreCb);

start();

function hideSelectedCb(event) {
  const checked = get(event, ["target", "checked"], false);

  resultContainer.classList.toggle("hide-selected", checked);
  hideSelectedToggle.checked = checked;
  hideSelectedToggleInternal.checked = checked;

  let oldSettings = localStorage.getItem(SETTINGS);
  if (!isPlainObject(oldSettings)) {
    oldSettings = {};
  }
  localStorage.setItem(
    SETTINGS,
    JSON.stringify({ ...oldSettings, [HIDE_SELECTED]: checked })
  );
}

async function searchCb(event) {
  event.preventDefault();
  const term = (searchInput.value || "").trim();
  if (!term) {
    return;
  }

  const loadingOff = loadingOn();

  const url = new URL("/search", location.origin);
  const params = { term, offset: 0, maxCount: MAX_COUNT };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const cardsArray = JSON.parse(await response.json());

  await renderCards(cardsArray);

  loadingOff();

  localStorage.setItem(SEARCH_RESULTS, JSON.stringify(cardsArray));
  localStorage.setItem(SEARCH_TERM, JSON.stringify(term));

  if (cardsArray.length % MAX_COUNT === 0) {
    loadMoreBtn.style.display = "";
  }
}

async function loadMoreCb() {
  const offset = resultContainer.childElementCount;
  let term;
  try {
    term = JSON.parse(localStorage.getItem(SEARCH_TERM));
  } catch (error) {
    console.log("Invalid localStorage item");
  }

  if (!term || offset % MAX_COUNT !== 0) {
    loadMoreBtn.style.display = "none";
    return;
  }

  const loadingOff = loadingOn();

  const url = new URL("/search", location.origin);
  const params = { term: searchInput.value, offset, maxCount: MAX_COUNT };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const cardsArray = JSON.parse(await response.json());

  const oldSearchResults = JSON.parse(localStorage.getItem(SEARCH_RESULTS));
  localStorage.setItem(
    SEARCH_RESULTS,
    JSON.stringify([...oldSearchResults, ...cardsArray])
  );

  await renderCards(cardsArray, true);

  loadingOff();

  if (cardsArray.length % MAX_COUNT !== 0) {
    loadMoreBtn.style.display = "none";
  }
}

function clearCb(event) {
  event.preventDefault();
  renderCards([]);

  searchForm.reset();
  localStorage.clear();

  recommendContainer
    .querySelectorAll(".btn.btn-danger")
    .forEach((btn) => btn.removeEventListener("click", recommendBtnCb));
  recommendContainer.innerHTML = "";
}

function addCb(event) {
  const card = event.target.closest(".card");
  const cardContainer = event.target.closest(".col");

  if (!localStorage.getItem(card.id)) {
    if (recommendContainer.childElementCount >= MAX_REC_ITEMS) {
      errorTooManySelectedBtn.click();
      return;
    }

    const searchResults =
      JSON.parse(localStorage.getItem(SEARCH_RESULTS)) || [];

    let titleData;
    for (const title of searchResults) {
      if (card.id === String(title.id)) {
        titleData = title;
        break;
      }
    }

    if (titleData) {
      cardContainer.classList.add("selected");
      event.target.classList.replace("btn-outline-secondary", "btn-success");
      localStorage.setItem(card.id, JSON.stringify(titleData));
      createRecButton(titleData.id, titleData.title);
    }
  } else {
    cardContainer.classList.remove("selected");
    event.target.classList.replace("btn-success", "btn-outline-secondary");
    localStorage.removeItem(card.id);
    const currentButton = document.querySelector(`[data-id="${card.id}"]`);
    if (currentButton) {
      currentButton.removeEventListener("click", recommendBtnCb);
      currentButton.closest(".btn-group")?.remove();
    }
  }
}

function createRecButton(id, title) {
  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("btn-group", "m-1");
  buttonGroup.role = "group";

  const buttonDelete = document.createElement("button");
  buttonDelete.dataset.id = id;
  buttonDelete.classList.add("btn", "btn-danger");
  buttonDelete.innerText = "X";
  buttonDelete.addEventListener("click", recommendBtnCb);

  const buttonTitle = document.createElement("button");
  buttonTitle.disabled = true;
  buttonTitle.classList.add("btn", "btn-outline-dark");
  buttonTitle.innerText = title;

  buttonGroup.appendChild(buttonTitle);
  buttonGroup.appendChild(buttonDelete);
  recommendContainer.appendChild(buttonGroup);
}

function recommendBtnCb(event) {
  event.target.removeEventListener("click", recommendBtnCb);
  localStorage.removeItem(event.target.dataset.id);
  event.target.closest(".btn-group")?.remove();
  const card = document.getElementById(event.target.dataset.id);
  if (card) {
    const cardContainer = card.closest(".col");
    cardContainer.classList.remove("selected");
    card
      .querySelector(".add")
      .classList.replace("btn-success", "btn-outline-secondary");
  }
}

function start() {
  const {
    arrayOfRecomends,
    settings,
    [SEARCH_RESULTS]: searchResults,
    [SEARCH_TERM]: searchTerm,
  } = getLocalStorgeData();

  arrayOfRecomends?.forEach((card) => {
    if (card?.id && card?.title) {
      createRecButton(card.id, card.title);
    }
  });

  if (searchResults?.length > 0) {
    renderCards(searchResults);
  }

  if (searchTerm) {
    searchInput.value = searchTerm;
    if (searchResults?.length % MAX_COUNT === 0) {
      loadMoreBtn.style.display = "";
    }
  }

  const settingsHideSelected = get(settings, [HIDE_SELECTED], false);
  if (settingsHideSelected) {
    hideSelectedToggle.click();
  }
}

async function renderCards(cardsArray, addingMode) {
  if (!cardsArray) {
    return;
  }

  if (tooltipsStore.length > 0) {
    tooltipsStore.forEach((tooltip) => {
      if (tooltip && isFunction(tooltip.dispose)) {
        tooltip.dispose();
      }
    });
    remove(tooltipsStore);
  }

  resultContainer
    .querySelectorAll(".add")
    .forEach((addButton) => addButton.removeEventListener("click", addCb));

  resultContainer
    .querySelectorAll(".synopsis")
    .forEach((synopsisButton) =>
      synopsisButton.removeEventListener("click", synopsisCb)
    );

  resultContainer
    .querySelectorAll('.card .card-header[data-bs-toggle="tooltip"]')
    .forEach((tooltipTrigger) =>
      tooltipTrigger.removeEventListener("pointerenter", turnOnTooltip)
    );

  resultContainer
    .querySelectorAll(".card .card-body")
    .forEach((cardBody) =>
      cardBody.removeEventListener("click", descriptionToogle)
    );

  for (const card of cardsArray) {
    if (localStorage.getItem(card.id)) {
      card.alreadyAdd = true;
    }
  }
  const renderedResult = await renderHbs({ cardsArray }, "/hbs/card.hbs");
  if (addingMode) {
    const parsedHtml = parser.parseFromString(renderedResult, "text/html");
    const body = parsedHtml.querySelector("body");
    resultContainer.append(...body.childNodes);
  } else {
    resultContainer.innerHTML = renderedResult;
  }

  resultContainer
    .querySelectorAll(".add")
    .forEach((addButton) => addButton.addEventListener("click", addCb));

  resultContainer
    .querySelectorAll(".synopsis")
    .forEach((synopsisButton) =>
      synopsisButton.addEventListener("click", synopsisCb)
    );

  resultContainer
    .querySelectorAll('.card .card-header[data-bs-toggle="tooltip"]')
    .forEach((tooltipTrigger) =>
      tooltipTrigger.addEventListener("pointerenter", turnOnTooltip)
    );

  resultContainer
    .querySelectorAll(".card .card-body")
    .forEach((cardBody) =>
      cardBody.addEventListener("click", descriptionToogle)
    );
}

function loadingOn() {
  const removeSpinner = addSpinner([
    searchInput,
    searchBtn,
    clearForm,
    searchByRec,
    loadMoreBtn,
  ]);

  spinner.style.display = "block";

  return () => {
    spinner.style.display = "none";
    removeSpinner.forEach((cb) => cb());
  };
}

async function searchByRecCb() {
  const { arrayOfId } = getLocalStorgeData();

  if (!arrayOfId?.length) {
    return;
  }

  const loadingOff = loadingOn();

  const response = await fetch("/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ arrayOfId }),
  });
  const cardsArray = JSON.parse(await response.json());

  await renderCards(cardsArray);

  loadingOff();

  localStorage.setItem(SEARCH_RESULTS, JSON.stringify(cardsArray));
  localStorage.removeItem(SEARCH_TERM);
}

async function synopsisCb(event) {
  const button = event.target;
  button.removeEventListener("click", synopsisCb);
  const card = button.closest(".card");

  const removeSpinner = addSpinner(button);

  const response = await fetch("/recommend/synopsis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: card.id }),
  });

  const { synopsis, score, episodes, duration } =
    JSON.parse(await response.json()) || {};

  const synopsisEl = card.querySelector(".synopsis-value") || {};
  const scoreEl = card.querySelector(".score-value") || {};
  const durationEl = card.querySelector(".duration-value") || {};

  synopsisEl.innerText = synopsis;
  scoreEl.innerText = score;
  durationEl.innerText = `${episodes} ep. x ${duration} min.`;

  descriptionToogle(event);

  removeSpinner();
  button?.remove();
}
