// ==UserScript==
// @name        ForceDict
// @namespace   ForceDict
// @match       *://*google.com/search*
// @icon        https://i.imgur.com/a/IznCc6T
// @run-at      document-start
// @noframes
// @grant       GM_xmlhttpRequest
// @author      -
// @description A userscript to bring back the old google dictionary using wordhippo's API.
// ==/UserScript==

const params = new URLSearchParams(window.location.search);
if (!(params.get("udm") == null || params.get("udm") == "4")) return;
// only execute in the "all" tab
const query = params.get("q") ?? params.get("query") ?? "";
const queryArr = query.split(" ");
const keywords = ["def", "define", "synonyms", "definition", "of", "for"];
// this can look up when something is "adfasf of asdafasdf" so fix that
const shouldExecute = queryArr.some((word) => keywords.includes(word));
if (shouldExecute && queryArr.length <= 3) {
  const word = queryArr.filter((word) => !keywords.includes(word)).join(" ");
  console.log(`word: ${word}`);
  killAI();
  getWordInfo(word).then((wordInfo) => {
    if (!wordInfo) {
      const wordNotFound = document.createElement("h2");
      wordNotFound = `A definition could not be found for "${word}"`;
      document.querySelector("#rcnt").prepend(wordNotFound);
      return;
    }
    appendToCenterCol(wordInfo);
  });
}

function appendToCenterCol(wordInfo) {
  const centerCol = document.querySelector("#center_col");
  if (centerCol) {
    console.log("centerCol loaded");
    const dictionaryCard = createDictionaryCard(wordInfo);
    centerCol.prepend(dictionaryCard);
    return;
  }
  const observer = new MutationObserver(() => {
    const centerCol = document.querySelector("#center_col");
    if (centerCol) {
      observer.disconnect();
      console.log("centerCol loaded");
      const dictionaryCard = createDictionaryCard(wordInfo);
      centerCol.prepend(dictionaryCard);
    }
  });
  observer.observe(document.body, { childList: true });
}

function killAI() {
  const aiOverviewDiv = document.querySelector("[jsname=Ya7sxe]");
  if (aiOverviewDiv) {
    aiOverviewDiv.remove();
    console.log("AI Overview eliminated.");
    return;
  }
  const observer = new MutationObserver(() => {
    const aiOverviewDiv = document.querySelector("[jsname=Ya7sxe]");
    if (aiOverviewDiv) {
      observer.disconnect();
      console.log("aiOverviewDiv loaded");
      aiOverviewDiv.remove();
      console.log("AI Overview eliminated.");
    }
  });
  observer.observe(document.body, { childList: true });
}

function createCardLayout(dictionaryCard) {
  const header = document.createElement("h3");
  header.textContent = "Dictionary";
  dictionaryCard.appendChild(header);

  const dictionaryContainer = document.createElement("div");
  dictionaryContainer.classList.add("container");
  dictionaryCard.appendChild(dictionaryContainer);

  const pronounciationDiv = document.createElement("div");
  pronounciationDiv.id = "pronounciationDiv";
  dictionaryContainer.appendChild(pronounciationDiv);

  const pronounciationBtnDiv = document.createElement("div");
  pronounciationBtnDiv.id = "pronounciationBtnDiv";
  pronounciationDiv.appendChild(pronounciationBtnDiv);

  const pronounciationAudio = document.createElement("audio");
  pronounciationAudio.id = "pronounciationAudio";
  pronounciationBtnDiv.appendChild(pronounciationAudio);

  const pronounciationImgBtn = document.createElement("img");
  pronounciationImgBtn.addEventListener("click", () => {
    document.querySelector("#pronounciationAudio").play();
  });
  pronounciationBtnDiv.appendChild(pronounciationAudio);

  const wordLabelDiv = document.createElement("div");
  wordLabelDiv.id = "wordLabelsDiv";
  pronounciationDiv.appendChild(wordLabelDiv);

  const wordP = document.createElement("p");
  wordP.id = "wordP";
  wordLabelDiv.appendChild(wordP);
  // in case i forget again i think that the wordP is for the big word display on the top
}

function fillCard(wordInfo, dictionaryCard) {
  // maybe i can display 3 and then hide the rest but have an arrow to show 3 more
  const word = wordInfo.word;
  const wordP = dictionaryCard.querySelector("#wordP");
  const pronounciationAudio = dictionaryCard.querySelector(
    "#pronounciationAudio",
  );

  wordP.textContent = word;
  pronounciationAudio.src = `https://translate.google.com/translate_tts?tl=en-US&client=t&q=${word}`;
  for (let wordDefinition of wordInfo.definitions) {
    const type = wordDefinition.type;
    const definition = wordDefinition.definition;
    const sentence = wordDefinition.sentence;
    const synonyms = wordDefinition.synonyms;

    const definitionContainer = document.createElement("div");
    definitionContainer.classList.add("definitionContainer");
    dictionaryCard.appendChild(definitionContainer);

    const typeP = document.createElement("p");
    typeP.classList.add("typeP");
    typeP.textContent = type;
    definitionContainer.appendChild(typeP);

    const definitionP = document.createElement("p");
    definitionP.classList.add("definition");
    definitionP.textContent = definition;
    definitionContainer.appendChild(definitionP);

    const sentenceP = document.createElement("p");
    sentenceP.classList.add("example");
    sentenceP.textContent = sentence;
    definitionContainer.appendChild(sentenceP);

    const synonymsDiv = document.createElement("div");
    synonymsDiv.classList.add("synonymsDiv");
    definitionContainer.appendChild(synonymsDiv);

    for (let i = 0; i < 5; i++) {
      const synonymA = document.createElement("a");
      synonymA.classList.add("synonym");
      synonymA.textContent = synonyms[i];
      synonymA.href = `https://www.google.com/search?q=define+${synonymA.textContent}`;
      synonymsDiv.appendChild(synonymA);
    }
  }
}

function createDictionaryCard(wordInfo) {
  const dictionaryCard = document.createElement("div");
  dictionaryCard.id = "dictionaryCard";
  createCardLayout(dictionaryCard);
  fillCard(wordInfo, dictionaryCard);
  return dictionaryCard;
}

function styleDictionaryCard() {
  const css = ``;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

async function createParserRootEl(word) {
  const parserRootEl = document.createElement("html");
  const response = await new Promise((resolve) => {
    GM_xmlhttpRequest({
      url: `https://www.wordhippo.com/what-is/another-word-for/${encodeURIComponent(word)}.html`,
      onload: (response) => {
        resolve(response);
      },
      onerror: () => {
        console.log("error while fetching word");
      },
    });
  });
  const html = response?.responseText;
  if (!html) {
    console.log("returned html is empty");
    return null;
  }
  parserRootEl.innerHTML = html;
  return parserRootEl;
}

async function getWordInfo(word) {
  let wordInfo = {
    word: word,
    definitions: [],
  };
  const parserRootEl = await createParserRootEl(word);
  if (parserRootEl === null) return null;

  let currentElement = parserRootEl.querySelector(".wordtype");
  if (!currentElement) {
    return null;
  }
  while (true) {
    if (currentElement.classList.contains("wordtype")) {
      let definition = {};
      definition.type = currentElement.firstChild.textContent.trim();
      wordInfo.definitions.push(definition);
    } else if (currentElement.classList.contains("tabdesc")) {
      let definitionSentence = currentElement.textContent;
      wordInfo.definitions.at(-1).definition = definitionSentence;
    } else if (currentElement.classList.contains("relatedwords")) {
      let synonyms = [];
      currentElement.querySelectorAll(".wb a").forEach((node) => {
        synonyms.push(node.textContent);
      });
      wordInfo.definitions.at(-1).synonyms = synonyms;
    } else if (currentElement.classList.contains("tabexample")) {
      let quotedSentence = currentElement.textContent.trim("");
      let trimmedSentence = quotedSentence.replace(/“|”/g, "");
      wordInfo.definitions.at(-1).sentence = trimmedSentence;
    } else {
      return wordInfo;
    }
    currentElement = currentElement.nextElementSibling;
  }
}