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
const keywords = ["def", "define", "synonyms", "definition", "of", "for"];
// this can look up when something is "adfasf of asdafasdf" so fix that
const shouldExecute = queryArr.some((word) => keywords.includes(word));
if (shouldExecute && queryArr.length <= 3) {
  const word = queryArr.filter((word) => !keywords.includes(word)).join(" ");
  if (!word.trim()) return;
  console.log(`word: ${word}`);
  killAI();
  getWordInfo(word).then((wordInfo) => {
    if (!wordInfo) {
      // im pretty sure this thingy just doesnt work at all
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