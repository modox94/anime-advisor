const { isArray, get, isObjectLike } = require("lodash");
const { REDIS_TYPES, NO_DATA } = require("./constants");

exports.getRedisKey = (type, body = {}) => {
  switch (type) {
    case REDIS_TYPES.SEARCH: {
      let { term, offset, maxCount } = body;
      term = term.trim();
      offset = Number(offset);
      maxCount = Number(maxCount);

      return JSON.stringify({ type, body: { term, offset, maxCount } });
    }

    case REDIS_TYPES.SEARCH_ITEM: {
      let { id } = body;
      id = Number(id);

      return JSON.stringify({ type, body: { id } });
    }

    case REDIS_TYPES.RECOMMENDATIONS: {
      let { id } = body;
      id = Number(id);

      return JSON.stringify({ type, body: { id } });
    }

    default:
      console.log("Invalid type value", type);
      return JSON.stringify({ type, body });
  }
};

const recomposeFromSearch = (data) => {
  if (isArray(data)) {
    return data.map((item) => recomposeFromSearch(item));
  }

  if (isObjectLike(data)) {
    const id = get(data, ["id"], 0);
    const url = get(data, ["url"], "");
    const image =
      get(data, ["image", "webp", "default"]) ||
      get(data, ["image", "jpg", "default"], "");
    const title = get(data, ["title", "default"], "");
    const score = get(data, ["score"], 0);
    const synopsis = get(data, ["synopsis"], NO_DATA);
    const duration = get(data, ["duration"], 0);
    const year = get(data, ["year"], 0);

    return { id, url, image, title, score, synopsis, duration, year };
  }
};

exports.recomposeFromSearch = recomposeFromSearch;

const recomposeFromRecommendations = (data) => {
  if (isArray(data)) {
    return data.map((item) => recomposeFromRecommendations(item));
  }

  if (isObjectLike(data)) {
    const id = get(data, ["entry", "id"], 0);
    const url = get(data, ["entry", "url"], "");
    const image = get(data, ["entry", "image", "default"]);
    const title = get(data, ["entry", "title"], "");
    const votes = get(data, ["votes"], 0);

    return { id, url, image, title, votes };
  }
};

exports.recomposeFromRecommendations = recomposeFromRecommendations;
