let searchForm = document.getElementById('searchForm');
let searchInput = document.getElementById('searchInput');
let clearForm = document.getElementById('clearForm');

let reusltContainer = document.getElementById('result');
let recommendContainer = document.getElementById('recommend');

let addButtons = [...document.getElementsByClassName('add')];

searchForm.addEventListener('submit', callbackSearch);
clearForm.addEventListener('click', callbackClear);
addButtons.addEventListener('click', callbackAdd);

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

  console.log(arrayOfTitles);

  reusltContainer.innerHTML = await renderHbs(
    { arrayOfTitles },
    '/hbs/card.hbs'
  );
  // localStorage.setItem('examplekey', searchInput.value);
}

function callbackClear(event) {
  event.preventDefault();
  searchForm.reset();
  localStorage.clear();
}

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

// компилятор hbs
async function renderHbs(data, url) {
  let template = await fetch(url);
  template = await template.text();
  console.log(template);
  let itemRender = Handlebars.compile(template);
  return itemRender(data);
}
