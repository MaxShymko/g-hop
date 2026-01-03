const MAIN_CONTENT_SELECTOR = "#main";

const getH3Links = () =>
  [
    ...document.body.querySelectorAll(`${MAIN_CONTENT_SELECTOR} a[href] > h3`),
  ].map((node) => node.parentElement);

const getPeopleAlsoAskLinks = (expanded = false) => {
  const buttonContainers = [
    ...document.body.querySelectorAll(
      `${MAIN_CONTENT_SELECTOR} div > div[role="button"][aria-expanded=${expanded}]`,
    ),
  ].map((node) => node.parentElement.parentElement);

  return buttonContainers
    .map((node) => node.querySelector("a > h3"))
    .map((node) => node?.parentElement)
    .filter(Boolean);
};

const getL1Links = () => {
  const h3Links = getH3Links();
  const peopleAlsoAskLinks = getPeopleAlsoAskLinks();

  // filter out unnecessary links
  const l1Links = h3Links.filter(
    (e) => e.checkVisibility() && peopleAlsoAskLinks.indexOf(e) < 0,
  );

  return l1Links;
};

const getNearestElement = (anchor, elements) => {
  const { x, y } = anchor.getBoundingClientRect();
  const nearestElement = elements
    .map((element) => {
      const { x: x1, y: y1 } = element.getBoundingClientRect();
      return {
        element,
        distance: Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)),
      };
    })
    .sort((a, b) => a.distance - b.distance)[0].element;
  return nearestElement;
};

const focusWithOffset = (element) => {
  element.focus({ preventScroll: true });
  const offset = 200;
  const rect = element.getBoundingClientRect();
  const topOffset = rect.top - offset;
  const bottomOffset = rect.bottom + offset - window.innerHeight;
  if (topOffset < 0) {
    window.scrollBy({ top: topOffset });
  } else if (bottomOffset > 0) {
    window.scrollBy({ top: bottomOffset });
  }
};

const focusL1Link = (offset) => {
  const l1Links = getL1Links();

  // mark all links with attribute to apply styles
  l1Links.forEach((element) => element.setAttribute("data-gsk-ext-l1", "true"));

  const currentL1LinkElementIndex = l1Links.findIndex(
    (l1Link) => l1Link === document.activeElement,
  );

  let currentElement;

  if (currentL1LinkElementIndex === -1) {
    currentElement = getNearestElement(document.activeElement, l1Links);
  } else {
    currentElement = l1Links[currentL1LinkElementIndex + offset];
  }

  if (currentElement) {
    focusWithOffset(currentElement);
  }
};

document.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    return;
  }

  const keyHandlers = {
    KeyJ: () => focusL1Link(1),
    KeyK: () => focusL1Link(-1),
    KeyO: () => document.activeElement.click(),
  };

  const handler = keyHandlers[event.code];
  if (!handler) {
    return;
  }

  handler();
  event.preventDefault();
});

focusL1Link(0);
