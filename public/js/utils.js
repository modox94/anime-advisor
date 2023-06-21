export const SEARCH_RESULTS = "searchResults";

export const SETTINGS = "settings";

export const HIDE_SELECTED = "hideSelected";

export const getLocalStorgeData = () => {
  const result = {};

  for (const key in localStorage) {
    const value = localStorage.getItem(key);

    if (key === SEARCH_RESULTS || key === SETTINGS) {
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
