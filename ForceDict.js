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
const shouldExecute = queryArr.some((word) => keywords.includes(word));
if (shouldExecute && queryArr.length <= 3) {
  const centerCol = document.querySelector("#center_col");
  const word = queryArr.filter((word) => !keywords.includes(word)).join(" ");
  console.log(`word: ${word}`);
  getWordInfo(word).then((wordInfo) => {
    killAI();
    if (!wordInfo) {
      const wordNotFound = document.createElement("h2");
      wordNotFound = `A definition could not be found for "${word}"`;
      document.querySelector("#rcnt").prepend(wordNotFound);
      killAI();
      return;
    }
    // if the parentElement is loaded fill card otherwise set a mutationobserver
    if (centerCol) {
      console.log("centerCol already loaded!");
      const dictionaryCard = createDictionaryCard(wordInfo);
      centerCol.prepend(dictionaryCard);
    } else {
      console.log("centerCol not loaded, creating mutationObserver...");
      const observer = new MutationObserver((mutationList) => {
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
  });
}

function killAI() {
  const aiOverviewDiv = document.querySelector("[jsname=Ya7sxe]");
  if (aiOverviewDiv) {
    console.log("AI Overview already loaded!");
    document.querySelector("[jsname=Ya7sxe]").remove();
    console.log("AI Overview eliminated.");
  } else {
    console.log("AI Overview not loaded, creating mutationObserver...");
    const observer = new MutationObserver((mutationList) => {
      const aiOverviewDiv = document.querySelector("[jsname=Ya7sxe]");
      if (aiOverviewDiv) {
        observer.disconnect();
        console.log("aiOverviewDiv loaded");
        document.querySelector("[jsname=Ya7sxe]").remove();
        console.log("AI Overview eliminated.");
      }
    });
    observer.observe(document.body, { childList: true });
  }
}
