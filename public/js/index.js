import get from "./lodash/get.js";
import isFinite from "./lodash/isFinite.js";
import isFunction from "./lodash/isFunction.js";
import isPlainObject from "./lodash/isPlainObject.js";
import noop from "./lodash/noop.js";
import remove from "./lodash/remove.js";
import {
  HIDE_SELECTED,
  SEARCH_RESULTS,
  SETTINGS,
  getLocalStorgeData,
} from "./utils.js";

// eslint-disable-next-line no-undef
const { Tooltip } = bootstrap;
const tooltipsStore = [];
// eslint-disable-next-line no-undef
const { compile } = Handlebars;
const templatesStore = {};

const turnOnTooltip = (event) => {
  const { target } = event;
  const { scrollWidth, clientWidth } = target;

  if (!target || !isFinite(scrollWidth) || !isFinite(clientWidth)) {
    return;
  }

  const oldTooltip = Tooltip.getInstance(target);

  if (scrollWidth > clientWidth) {
    if (!oldTooltip) {
      const newTooltip = Tooltip.getOrCreateInstance(target);
      tooltipsStore.push(newTooltip);
    }
  } else if (oldTooltip) {
    remove(tooltipsStore, (tooltipItem) => tooltipItem === oldTooltip);
    oldTooltip.dispose();
  }
};

async function renderHbs(data, url) {
  let templateFn = noop;
  if (templatesStore[url] && isFunction(templatesStore[url])) {
    templateFn = templatesStore[url];
  } else {
    const templateRaw = await fetch(url);
    const template = await templateRaw.text();
    templateFn = compile(template);
    templatesStore[url] = templateFn;
  }

  return templateFn(data);
}

function descriptionToogle(event) {
  if (!event || !event.target) {
    return;
  }

  const card = event.target.closest(".card");
  if (!card) {
    return;
  }

  const cardText = card.querySelector(".card-text") || {};

  if ((cardText.innerText || "").trim()) {
    cardText.classList.toggle("line-сlamp");
  }
}

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearForm = document.getElementById("clearForm");
const hideSelectedToggle = document.getElementById("hideSelectedToggle");
const hideSelectedToggleInternal = document.getElementById(
  "hideSelectedToggleInternal"
);
const searchByRec = document.getElementById("searchByRec");

const resultContainer = document.getElementById("result");
const recommendContainer = document.getElementById("recommend");

const spinner = document.getElementById("spinner");

searchForm.addEventListener("submit", callbackSearch);
clearForm.addEventListener("click", callbackClear);
hideSelectedToggle.addEventListener("click", hideSelectedCallback);
hideSelectedToggleInternal.addEventListener("click", hideSelectedCallback);
searchByRec.addEventListener("click", callbackSearchByRec);
start();

function hideSelectedCallback(event) {
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

async function callbackSearch(event) {
  event.preventDefault();
  spinner.style.display = "block";

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ term: searchInput.value }),
  });
  const cardsArray = JSON.parse(await response.json());

  await renderCards(cardsArray);

  spinner.style.display = "none";
  localStorage.setItem(SEARCH_RESULTS, JSON.stringify(cardsArray));
}

function callbackClear(event) {
  event.preventDefault();
  renderCards([]);

  searchForm.reset();
  localStorage.clear();
  recommendContainer.innerHTML = ""; // TODO
}

function callbackAdd(event) {
  const card = event.target.closest(".card");
  const cardContainer = event.target.closest(".col");

  if (!localStorage.getItem(card.id)) {
    const searchResults = JSON.parse(localStorage.getItem(SEARCH_RESULTS));

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
      makeRecButton(titleData.id, titleData.title?.default);
    }
  } else {
    cardContainer.classList.remove("selected");
    event.target.classList.replace("btn-success", "btn-outline-secondary");
    localStorage.removeItem(card.id);
    const currentButton = document.querySelector(`[data-id="${card.id}"]`); //TODO
    if (currentButton) {
      currentButton.removeEventListener("click", callbackRecButton);
      currentButton.remove();
    }
  }
}

function makeRecButton(id, title) {
  const currentButton = document.createElement("button");
  currentButton.dataset.id = id;
  currentButton.classList.add("btn", "btn-warning", "m-1");
  currentButton.innerText = title;
  currentButton.addEventListener("click", callbackRecButton);
  recommendContainer.appendChild(currentButton);
}

function callbackRecButton(event) {
  event.target.removeEventListener("click", callbackRecButton);
  localStorage.removeItem(event.target.dataset.id);
  event.target.remove();
  const currentCard = document.getElementById(event.target.dataset.id);
  if (currentCard) {
    currentCard
      .querySelector(".add")
      .classList.replace("btn-success", "btn-outline-secondary");
  }
}

function start() {
  // TODO
  const { arrayOfRecomends, settings } = getLocalStorgeData();

  arrayOfRecomends?.forEach((card) => {
    if (card?.id && card?.title) {
      makeRecButton(card.id, card.title?.default);
    }
  });

  const settingsHideSelected = get(settings, [HIDE_SELECTED], false);
  if (settingsHideSelected) {
    hideSelectedToggle.click();
    // hideSelectedToggleInternal.checked = true
  }
}

async function renderCards(cardsArray) {
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
    .forEach((addButton) =>
      addButton.removeEventListener("click", callbackAdd)
    );

  resultContainer
    .querySelectorAll(".synopsis")
    .forEach((synopsisButton) =>
      synopsisButton.removeEventListener("click", callbackSynopsis)
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
  resultContainer.innerHTML = renderedResult;

  resultContainer
    .querySelectorAll(".add")
    .forEach((addButton) => addButton.addEventListener("click", callbackAdd));

  resultContainer
    .querySelectorAll(".synopsis")
    .forEach((synopsisButton) =>
      synopsisButton.addEventListener("click", callbackSynopsis)
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

async function callbackSearchByRec() {
  spinner.style.display = "block";

  const { arrayOfId, arrayOfRecomends } = getLocalStorgeData();

  if (!arrayOfId?.length || !arrayOfRecomends?.length) {
    spinner.style.display = "none";
    return;
  }

  const response = await fetch("/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ arrayOfId, arrayOfRecomends }),
  });
  const cardsArray = JSON.parse(await response.json());

  await renderCards(cardsArray);

  spinner.style.display = "none";
  localStorage.setItem(SEARCH_RESULTS, JSON.stringify(cardsArray));
}

async function callbackSynopsis(event) {
  const button = event.target;
  button.removeEventListener("click", callbackSynopsis);

  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden">Loading...</span>';
  button.disabled = true;

  const card = button.closest(".card");

  const response = await fetch("/recommend/synopsis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: card.id }),
  });

  const { dataOfTitle, arrayOfTorrents } = JSON.parse(await response.json());

  let magnetHtml = "";
  if (arrayOfTorrents?.length) {
    for (const torrent of arrayOfTorrents) {
      magnetHtml += "\n<br>";
      magnetHtml += `<a href="${torrent.magnet}">☠ ${torrent.name} [${torrent.filesizeGb} Gb]</a>`;
    }
  }
  if (magnetHtml) {
    magnetHtml += `\n<br>\n<a href="https://nyaa.net/search?c=3_5&q=${dataOfTitle.title}">☠ Search more torrents... ☠</a>`;
  }

  const cardText = card.querySelector(".card-text") || {};
  cardText.innerHTML = dataOfTitle.synopsis + magnetHtml;

  descriptionToogle(event);

  button.remove();
}

/*
после отрисовки результатов поиска мы добавляем кнопку искать рекоменлации после всех тайтов
желательно вывод тайтлов уменьшить до 10 или около того

после нажажатия на поиск рекомендация у нас стирается результат поиска,
создается новая группа тайтлов поиск по рекомендациям, индексы для которых мы будем хранить в локалсторадж
*/
