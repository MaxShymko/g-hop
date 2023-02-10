const MAIN_CONTENT_SELECTOR = "#rcnt";

const getH3Links = () =>
  [...document.body.querySelectorAll(`${MAIN_CONTENT_SELECTOR} a > h3`)].map(
    (node) => node.parentElement
  );

const getPeopleAlsoAskLinks = (expanded = false) =>
  [
    ...document.body.querySelectorAll(
      `${MAIN_CONTENT_SELECTOR} div[role="button"][aria-expanded=${expanded}] + div a > h3`
    ),
  ].map((node) => node.parentElement);

const getL1Links = () => {
  const h3Links = getH3Links();
  const peopleAlsoAskLinks = getPeopleAlsoAskLinks();
  return h3Links
    .filter((h3Link) => peopleAlsoAskLinks.indexOf(h3Link) < 0)
    .map((element) => {
      element.setAttribute("data-gsk-ext-l1", "true");
      return element;
    });
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

const focusNext = () => {
  const l1Links = getL1Links();

  const currentL1LinkElementIndex = l1Links.findIndex(
    (l1Link) => l1Link === document.activeElement
  );

  let currentElement;

  if (currentL1LinkElementIndex === -1) {
    currentElement = getNearestElement(document.activeElement, l1Links);
  } else {
    currentElement = l1Links[currentL1LinkElementIndex + 1];
  }

  currentElement?.focus();
};

const focusPrev = () => {
  const l1Links = getL1Links();

  const currentL1LinkElementIndex = l1Links.findIndex(
    (l1Link) => l1Link === document.activeElement
  );

  let currentElement;

  if (currentL1LinkElementIndex === -1) {
    currentElement = getNearestElement(document.activeElement, l1Links);
  } else {
    currentElement = l1Links[currentL1LinkElementIndex - 1];
  }

  currentElement?.focus();
};

const focusFirst = () => {
  const firstLink = document.body.querySelector(
    `${MAIN_CONTENT_SELECTOR} a > h3`
  )?.parentElement;
  firstLink?.setAttribute("data-gsk-ext-l1", "true");
  firstLink?.focus();
};

document.addEventListener("keydown", (event) => {
  if (document.activeElement.tagName === "INPUT") {
    return;
  }

  if (event.code === "KeyJ") {
    focusNext();
    event.preventDefault();
  }
  if (event.code === "KeyK") {
    focusPrev();
    event.preventDefault();
  }
});

focusFirst();
