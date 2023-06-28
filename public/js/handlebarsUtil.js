import isFunction from "./lodash/isFunction.js";
import noop from "./lodash/noop.js";

// eslint-disable-next-line no-undef
const { compile } = Handlebars;

// eslint-disable-next-line no-undef
Handlebars.registerHelper(
  "isReadable",
  (value) => value && value !== "NO_DATA"
);
const templatesStore = {};

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

export { compile, renderHbs, templatesStore };
