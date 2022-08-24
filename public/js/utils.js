export const SEARCH_RESULTS = 'searchResults';

export const getLocalStorgeData = () => {
  const result = {};

  for (const key in localStorage) {
    const value = localStorage.getItem(key);
    if (key === SEARCH_RESULTS) {
      try {
        result[SEARCH_RESULTS] = JSON.parse(value);
      } catch (error) {
        console.log('invalid local storge record');
        console.log('key', key);
        console.log('value', value);
      }
      continue;
    }

    if (Number.isInteger(Number(key))) {
      try {
        const valueParsed = JSON.parse(value);

        if (!result.arrayOfId || !result.arrayOfRecomends) {
          result.arrayOfId = [];
          result.arrayOfRecomends = [];
        }

        result.arrayOfId.push(key);
        result.arrayOfRecomends.push(valueParsed);
      } catch (error) {
        console.log('invalid local storge record');
        console.log('key', key);
        console.log('value', value);
      }
    }
  }

  return result;
};
