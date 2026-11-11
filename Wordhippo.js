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

export default getWordInfo;
