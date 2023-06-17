import { SEARCH_RESULTS, getLocalStorgeData } from "./utils.js";
import isFinite from "./lodash/isFinite.js";

// eslint-disable-next-line no-undef
const { Tooltip } = bootstrap;
const tooltipsStore = [];

const turnOnTooltip = (event) => {
  const { target } = event;
  const { scrollWidth, clientWidth } = target;

  if (!target || !isFinite(scrollWidth) || !isFinite(clientWidth)) {
    return;
  }

  if (scrollWidth > clientWidth) {
    const tooltip = Tooltip.getOrCreateInstance(target);
    tooltipsStore.push(tooltip);
  } else {
    const tooltip = Tooltip.getInstance(target);
    if (tooltip) {
      tooltip.dispose();
    }
  }
};

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearForm = document.getElementById("clearForm");
const searchByRec = document.getElementById("searchByRec");

const resultContainer = document.getElementById("result");
const recommendContainer = document.getElementById("recommend");

const spinner = document.getElementById("spinner");

searchForm.addEventListener("submit", callbackSearch);
clearForm.addEventListener("click", callbackClear);
searchByRec.addEventListener("click", callbackSearchByRec);
start();

async function callbackSearch(event) {
  event.preventDefault();
  spinner.style.display = "block";

  const response = await fetch("/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ term: searchInput.value }),
  });

  const arrayOfTitles = JSON.parse(await response.json());

  for (const title of arrayOfTitles) {
    if (localStorage.getItem(title.id)) {
      title.alreadyAdd = true;
    }
  }

  const renderedResult = await renderHbs({ arrayOfTitles }, "/hbs/card.hbs");

  resultContainer.innerHTML = renderedResult;

  spinner.style.display = "none";

  const addButtons = [...document.getElementsByClassName("add")]; // TODO
  addButtons.forEach((addButton) => {
    addButton.addEventListener("click", callbackAdd);
  });

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  [...tooltipTriggerList].map((tooltipTriggerEl) => {
    const curTooltip = new Tooltip(tooltipTriggerEl, {
      placement: "auto",
    });
    tooltipTriggerEl.addEventListener("show.bs.tooltip", (event) => {
      // console.log("show.bs.tooltip", event);
      console.log("show.bs.tooltip");
      const {
        target: { scrollWidth, clientWidth },
      } = event;

      console.log(scrollWidth, clientWidth);

      if (scrollWidth <= clientWidth) {
        console.log("hide", curTooltip);
        curTooltip.hide();
        curTooltip.disable();
      }
    });
  });

  localStorage.setItem(SEARCH_RESULTS, JSON.stringify(arrayOfTitles));
}

function callbackClear(event) {
  event.preventDefault();
  searchForm.reset();
  localStorage.clear();
  resultContainer.innerHTML = "";
  recommendContainer.innerHTML = "";
}

function callbackAdd(event) {
  const card = event.target.closest(".card");

  if (!localStorage.getItem(card.id)) {
    const searchResults = JSON.parse(localStorage.getItem(SEARCH_RESULTS));

    console.log("searchResults", searchResults);

    let titleData;
    for (const title of searchResults) {
      if (card.id === String(title.id)) {
        titleData = title;
        break;
      }
    }

    console.log("titleData", titleData);

    event.target.className = "btn btn-sm btn-success add"; // TODO
    localStorage.setItem(card.id, JSON.stringify(titleData));
    makeRecButton(titleData.id, titleData.title?.default); // TODO
  } else {
    event.target.className = "btn btn-sm btn-outline-secondary add"; // TODO
    localStorage.removeItem(card.id);
    const currentButton = document.querySelector(`[data-id="${card.id}"]`);
    currentButton.removeEventListener("click", callbackRecButton);
    currentButton.remove();
  }
}

async function renderHbs(data, url) {
  let template = await fetch(url);
  template = await template.text();
  // eslint-disable-next-line no-undef
  const itemRender = Handlebars.compile(template);
  return itemRender(data);
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
    currentCard.getElementsByClassName("add")[0].className =
      "btn btn-sm btn-outline-secondary add"; // TODO
  }
}

function start() {
  const { arrayOfRecomends } = getLocalStorgeData();

  arrayOfRecomends?.forEach((card) => {
    if (card?.id && card?.title) {
      makeRecButton(card.id, card.title?.default);
    }
  });
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ arrayOfId, arrayOfRecomends }), // второй вариант - передавать только id всем хороший, но при разростании проекта будут беды с соотнесением с какого тайтла какая рекомендация
  });

  const arrayOfTitles = JSON.parse(await response.json());

  for (const title of arrayOfTitles) {
    if (localStorage.getItem(title.id)) {
      title.alreadyAdd = true;
    }
  }

  const renderedResult = await renderHbs({ arrayOfTitles }, "/hbs/card.hbs");

  resultContainer.innerHTML = renderedResult;

  const addButtons = [...resultContainer.querySelectorAll(".add")]; // TODO
  addButtons.forEach((addButton) => {
    addButton.addEventListener("click", callbackAdd);
  });

  const synopsisButtons = [...resultContainer.querySelectorAll(".synopsis")];
  synopsisButtons.forEach((synopsisButton) => {
    synopsisButton.addEventListener("click", callbackSynopsis);
  });

  const tooltipTriggerList = resultContainer.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  tooltipTriggerList.forEach((tooltipTrigger) => {
    tooltipTrigger.addEventListener("pointerenter", turnOnTooltip);
  });
  // [...tooltipTriggerList].map((tooltipTriggerEl) => {
  //   // eslint-disable-next-line no-undef
  //   const curTooltip = new Tooltip(tooltipTriggerEl, {
  //     placement: "auto",
  //   });
  //   tooltipTriggerEl.addEventListener("show.bs.tooltip", (event) => {
  //     // console.log("show.bs.tooltip", event);
  //     console.log("show.bs.tooltip");
  //     const {
  //       target: { scrollWidth, clientWidth },
  //     } = event;

  //     console.log(scrollWidth, clientWidth);

  //     if (scrollWidth <= clientWidth) {
  //       curTooltip.hide();
  //     }
  //   });
  // });

  spinner.style.display = "none";
  localStorage.setItem(SEARCH_RESULTS, JSON.stringify(arrayOfTitles));
}

async function callbackSynopsis(event) {
  const card = event.target.closest(".card");

  const response = await fetch("/recommend/synopsis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  if (magnetHtml)
    magnetHtml += `\n<br>\n<a href="https://nyaa.net/search?c=3_5&q=${dataOfTitle.title}">☠ Search more torrents... ☠</a>`;

  card.getElementsByClassName("card-text")[0].innerHTML =
    dataOfTitle.synopsis + magnetHtml;

  event.target.removeEventListener("click", callbackSynopsis);
  event.target.remove();
}

/*
после отрисовки результатов поиска мы добавляем кнопку искать рекоменлации после всех тайтов
желательно вывод тайтлов уменьшить до 10 или около того

после нажажатия на поиск рекомендация у нас стирается результат поиска,
создается новая группа тайтлов поиск по рекомендациям, индексы для которых мы будем хранить в локалсторадж
*/

// // плавное удаление элемента
// function removeBlock() {
//   let block = this;
//   block.style.opacity = 1;
//   let blockId = setInterval(function () {
//     if (block.style.opacity > 0) block.style.opacity -= 0.1;
//     else {
//       clearInterval(blockId);
//       block.remove();
//     }
//   }, 60);
// }
