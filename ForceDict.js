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

import getWordInfo from "./Wordhippo.js";
import createDictionaryCard from "./DictionaryCard.js";

const params = new URLSearchParams(window.location.search);
if (!(params.get("udm") == null || params.get("udm") == "4")) return;
// only execute in the "all" tab

const query = params.get("q") ?? params.get("query") ?? "";
const queryArr = query.split(" ");
const keywords = ["def", "define", "synonyms", "definition", "meaning"];

// if the override parameter is found, the script will execute and ignore checks. this is to fix clicking synonyms which contain >2 words.
const override = params.get("override");
if (override === null) {
  let shouldExecute = queryArr.some((word) => keywords.includes(word));
  if (!shouldExecute || queryArr.length > 3) return;
}

const word = queryArr.filter((word) => !keywords.includes(word)).join(" ");
if (!word.trim()) return;
console.log(`word: ${word}`);
killAI();
getWordInfo(word)
  .then((wordInfo) => {
    console.log(wordInfo);
    appendToCenterCol(wordInfo);
  })
  .catch(() => {
    appendWordNotFound(word);
  });

function appendWordNotFound(word) {
  const wordNotFoundEl = document.createElement("h3");
  wordNotFoundEl.id = "wordNotFound";
  wordNotFoundEl.textContent = `A definition could not be found for "${word}"`;
  wordNotFoundEl.style =
    "border: 1px solid var(--JKqx2); border-radius: 20px; padding: 20px; margin-bottom: 44px;";

  const centerCol = document.querySelector("#center_col");
  if (centerCol) {
    centerCol.prepend(wordNotFoundEl);
    return;
  }
  const observer = new MutationObserver(() => {
    const centerCol = document.querySelector("#center_col");
    if (centerCol) {
      observer.disconnect();
      centerCol.prepend(wordNotFoundEl);
    }
  });
  observer.observe(document.body, { childList: true });
}

function appendToCenterCol(wordInfo) {
  const centerCol = document.querySelector("#center_col");
  if (centerCol) {
    const dictionaryCard = createDictionaryCard(wordInfo);
    centerCol.prepend(dictionaryCard);
    return;
  }
  const observer = new MutationObserver(() => {
    const centerCol = document.querySelector("#center_col");
    if (centerCol) {
      observer.disconnect();
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