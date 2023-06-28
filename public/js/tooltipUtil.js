import remove from "./lodash/remove.js";

// eslint-disable-next-line no-undef
const { Tooltip } = bootstrap;
const tooltipsStore = [];

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

export { Tooltip, tooltipsStore, turnOnTooltip };
