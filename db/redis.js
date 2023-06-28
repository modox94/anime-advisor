const { isString, isFinite, isPlainObject } = require("lodash");
const { createClient } = require("redis");

const defaultOptions = {
  EX: 60 * 60 * 60 * 24, // seconds
  NX: true,
};

const redisClient = createClient(process.env.REDIS_URL);

let errorCounter = 0;
redisClient.on("error", (err) => {
  errorCounter++;

  if (errorCounter === 1 || errorCounter % 3600 === 0) {
    console.log("Redis client", errorCounter);
    console.log("Error", err);
  }

  if (errorCounter > 10800) {
    console.log("Redis client disconnected", errorCounter);
    redisClient.disconnect();
  }
});

redisClient.connect();

const redisGet = async (keyRaw) => {
  let key = keyRaw;

  if (isFinite(key)) {
    key = String(key);
  } else if (!isString(key)) {
    console.log("Invalid key", keyRaw);
    return undefined;
  }

  if (!redisClient) {
    console.log("Redis client is not exist", redisClient);
    return undefined;
  }

  if (redisClient.isReady && redisClient.isOpen) {
    const resultRaw = await redisClient.get(key);
    try {
      return JSON.parse(resultRaw);
    } catch (error) {
      console.log("Can't parse redis data", resultRaw);
      return resultRaw;
    }
  } else {
    console.log("Redis client is not opened", keyRaw);
    console.log("isReady", redisClient.isReady);
    console.log("isOpen", redisClient.isOpen);
  }
};

const redisSet = async (keyRaw, valueRaw, optionsRaw) => {
  let key = keyRaw;
  let value = valueRaw;
  const options = isPlainObject(optionsRaw)
    ? { ...defaultOptions, ...optionsRaw }
    : defaultOptions;

  if (isFinite(key)) {
    key = String(key);
  } else if (!isString(key)) {
    console.log("Invalid key", keyRaw);
    return undefined;
  }

  try {
    value = JSON.stringify(value);
  } catch (error) {
    console.log("Invalid value", valueRaw);
    return undefined;
  }

  if (!redisClient) {
    console.log("Redis client is not exist", redisClient);
    return undefined;
  }

  if (redisClient.isReady && redisClient.isOpen) {
    return await redisClient.set(key, value, options);
  } else {
    console.log("Redis client is not opened", keyRaw);
    console.log("isReady", redisClient.isReady);
    console.log("isOpen", redisClient.isOpen);
  }
};

exports.redisClient = redisClient;
exports.redisGet = redisGet;
exports.redisSet = redisSet;
