import isArray from "./lodash/isArray.js";
import noop from "./lodash/noop.js";

export const SEARCH_RESULTS = "searchResults";

export const SEARCH_TERM = "searchTerm";

export const SETTINGS = "settings";

export const HIDE_SELECTED = "hideSelected";

export const MAX_COUNT = 20;

export const MAX_REC_ITEMS = 10;

export const getLoadingSpinner = () => {
  const spanEl = document.createElement("span");
  spanEl.classList.add("spinner-border", "spinner-border-sm");
  return spanEl;
};

export const getLocalStorgeData = () => {
  const result = {};

  for (const key in localStorage) {
    const value = localStorage.getItem(key);

    if ([SEARCH_RESULTS, SEARCH_TERM, SETTINGS].includes(key)) {
      try {
        result[key] = JSON.parse(value);
      } catch (error) {
        console.log("invalid local storge record");
        console.log("key", key);
        console.log("value", value);
      }
    } else if (Number.isInteger(Number(key))) {
      try {
        const valueParsed = JSON.parse(value);

        if (!result.arrayOfId || !result.arrayOfRecomends) {
          result.arrayOfId = [];
          result.arrayOfRecomends = [];
        }

        result.arrayOfId.push(key);
        result.arrayOfRecomends.push(valueParsed);
      } catch (error) {
        console.log("invalid local storge record");
        console.log("key", key);
        console.log("value", value);
      }
    }
  }

  return result;
};

export const addSpinner = (elementOrArray) => {
  let element;
  if (isArray(elementOrArray)) {
    return elementOrArray.map((el) => addSpinner(el));
  } else {
    element = elementOrArray;
  }

  let spinnerSpan = { remove: noop };
  if (element.tagName === "BUTTON") {
    spinnerSpan = getLoadingSpinner();

    if (element.firstChild) {
      element.insertBefore(spinnerSpan, element.firstChild);
    } else {
      element.appendChild(spinnerSpan);
    }
  }
  element.disabled = true;

  return () => {
    element.disabled = false;
    spinnerSpan.remove();
  };
};
