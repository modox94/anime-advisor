let searchForm = document.getElementById('searchForm');
let searchInput = document.getElementById('searchInput');
let clearForm = document.getElementById('clearForm');
let searchByRec = document.getElementById('searchByRec');

let resultContainer = document.getElementById('result');
let recommendContainer = document.getElementById('recommend');

let addButtons;

searchForm.addEventListener('submit', callbackSearch);
clearForm.addEventListener('click', callbackClear);
searchByRec.addEventListener('click', callbackSearchByRec);
start();

async function callbackSearch(event) {
  event.preventDefault();

  let response = await fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ term: searchInput.value }),
  });

  let arrayOfTitles = JSON.parse(await response.json());

  for (let title of arrayOfTitles) {
    if (localStorage.getItem(title.mal_id)) {
      title.alreadyAdd = true;
    }
  }

  resultContainer.innerHTML = await renderHbs(
    { arrayOfTitles },
    '/hbs/card.hbs'
  );

  let addButtons = [...document.getElementsByClassName('add')];
  addButtons.forEach((addButton) => {
    addButton.addEventListener('click', callbackAdd);
  });

  localStorage.setItem('searchResults', JSON.stringify(arrayOfTitles));
  // localStorage.setItem('examplekey', searchInput.value);
}

function callbackClear(event) {
  event.preventDefault();
  searchForm.reset();
  localStorage.clear();
  resultContainer.innerHTML = '';
  recommendContainer.innerHTML = '';
}

function callbackAdd(event) {
  let card = event.target.closest('.col-md-3');

  if (!localStorage.getItem(card.id)) {
    let searchResults = JSON.parse(localStorage.getItem('searchResults'));
    let titleData;
    for (let title of searchResults) {
      if (card.id === String(title.mal_id)) {
        titleData = title;
        break;
      }
    }
    event.target.className = 'btn btn-sm btn-success add';
    localStorage.setItem(card.id, JSON.stringify(titleData));
    makeRecButton(titleData.mal_id, titleData.title);
  } else {
    event.target.className = 'btn btn-sm btn-outline-secondary add';
    localStorage.removeItem(card.id);
    let currentButton = document.querySelector(`[data-id="${card.id}"]`);
    currentButton.removeEventListener('click', callbackRecButton);
    currentButton.remove();
  }

  // let arrayForRecommend = localStorage.getItem('arrayForRecommend');
  // arrayForRecommend.push(card);
  // localStorage.setItem('arrayForRecommend', arrayForRecommend);
}

// компилятор hbs
async function renderHbs(data, url) {
  let template = await fetch(url);
  template = await template.text();
  let itemRender = Handlebars.compile(template);
  return itemRender(data);
}

function makeRecButton(id, title) {
  let currentButton = document.createElement('button');
  currentButton.dataset.id = id;
  currentButton.className = 'btn btn-outline-warning mx-1 my-1';
  currentButton.innerText = title;

  recommendContainer.appendChild(currentButton);
  currentButton.addEventListener('click', callbackRecButton);
}

function callbackRecButton(event) {
  event.target.removeEventListener('click', callbackRecButton);
  localStorage.removeItem(event.target.dataset.id);
  event.target.remove();
  let currentCard = document.getElementById(event.target.dataset.id);
  if (currentCard) {
    currentCard.getElementsByClassName('add')[0].className =
      'btn btn-sm btn-outline-secondary add';
  }
}

function start() {
  let arrayOfId = Object.keys(localStorage);

  for (let id of arrayOfId) {
    if (id !== 'searchResults') {
      let card = JSON.parse(localStorage.getItem(id));
      makeRecButton(card.mal_id, card.title);
    }
  }
}

async function callbackSearchByRec() {
  let arrayOfId = Object.keys(localStorage);
  let delId = arrayOfId.indexOf('searchResults');
  if (delId) {
    arrayOfId.splice(delId, 1);
  }
  let arrayOfRecomends = [];
  for (let id of arrayOfId) {
    // if (id !== 'searchResults') {
    arrayOfRecomends.push(JSON.parse(localStorage.getItem(id)));
    // }
  }

  let response = await fetch('/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ arrayOfId, arrayOfRecomends }), //второй вариант - передавать только id всем хороший, но при разростании проекта будут беды с соотнесением с какого тайтла какая рекомендация
  });

  let arrayOfTitles = JSON.parse(await response.json());

  for (let title of arrayOfTitles) {
    if (localStorage.getItem(title.mal_id)) {
      title.alreadyAdd = true;
    }
  }

  resultContainer.innerHTML = await renderHbs(
    { arrayOfTitles },
    '/hbs/card.hbs'
  );

  let addButtons = [...document.getElementsByClassName('add')];
  addButtons.forEach((addButton) => {
    addButton.addEventListener('click', callbackAdd);
  });

  localStorage.setItem('searchResults', JSON.stringify(arrayOfTitles));
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
