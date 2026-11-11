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

  const pronounciationImgBtn = document.createElement("button");
  pronounciationImgBtn.id = "pronounciationImgBtn";
  pronounciationBtnDiv.appendChild(pronounciationImgBtn);

  const pronounciationImg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  pronounciationImg.setAttribute("viewBox", "-9 -9 42 42");
  pronounciationImgBtn.appendChild(pronounciationImg);
  pronounciationImgBtn.addEventListener("click", () => {
    document.querySelector("#pronounciationAudio").play();
  });

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  );
  path.setAttribute("fill", "var(--xhUGwc)");
  pronounciationImg.appendChild(path);

  const wordLabelDiv = document.createElement("div");
  wordLabelDiv.id = "wordLabelsDiv";
  pronounciationDiv.appendChild(wordLabelDiv);

  const wordP = document.createElement("p");
  wordP.id = "wordP";
  wordLabelDiv.appendChild(wordP);
}

function fillCard(wordInfo, dictionaryCard) {
  // maybe i can display 3 and then hide the rest but have an arrow to show 3 more
  const word = wordInfo.word;
  const wordP = dictionaryCard.querySelector("#wordP");
  const pronounciationAudio = dictionaryCard.querySelector(
    "#pronounciationAudio",
  );

  wordP.textContent = word;
  pronounciationAudio.src = `https://translate.google.com/translate_tts?tl=en-US&tk&client=t&q=${encodeURIComponent(word)}`;

  wordInfo.definitions.forEach((wordDefinition, index) => {
    const type = wordDefinition.type;
    const definition = wordDefinition.definition;
    const sentence = wordDefinition.sentence;
    const synonyms = wordDefinition.synonyms;

    const definitionContainer = document.createElement("div");
    // just stick in a "if index >= 5 style display none" and then have a button which expands it
    definitionContainer.classList.add("definitionContainer");
    dictionaryCard.appendChild(definitionContainer);
    // may have to do some renaming

    // if its a different type than the last definition
    if (index === 0 || wordInfo.definitions[index - 1].type !== type) {
      const typeP = document.createElement("p");
      typeP.classList.add("typeP");
      typeP.textContent = type;
      definitionContainer.appendChild(typeP);
    }

    const ul = document.createElement("ul");
    definitionContainer.appendChild(ul);

    const li = document.createElement("li");
    ul.appendChild(li);

    const definitionP = document.createElement("p");
    definitionP.classList.add("definition");
    definitionP.textContent = definition;
    li.appendChild(definitionP);

    const sentenceP = document.createElement("p");
    sentenceP.classList.add("example");
    sentenceP.textContent = sentence;
    li.appendChild(sentenceP);

    const synonymsDiv = document.createElement("div");
    synonymsDiv.classList.add("synonymsDiv");
    li.appendChild(synonymsDiv);

    for (let i = 0; i < 5; i++) {
      // maybe i could do them all and only display the first 5 and add an arrow
      if (!synonyms[i]) break;
      const synonymA = document.createElement("a");
      synonymA.classList.add("synonym");
      synonymA.textContent = synonyms[i];
      synonymA.href = `https://www.google.com/search?q=define+${synonymA.textContent}`;
      synonymsDiv.appendChild(synonymA);
    }
  });
}

function createDictionaryCard(wordInfo) {
  const dictionaryCard = document.createElement("div");
  dictionaryCard.id = "dictionaryCard";
  createCardLayout(dictionaryCard);
  fillCard(wordInfo, dictionaryCard);
  styleDictionaryCard();
  return dictionaryCard;
}

function styleDictionaryCard() {
  const css = `
:root {
  --coolblue: var(--JKqx2);
}

#dictionaryCard {
  border: 1px solid var(--coolblue);
  border-radius: 20px;
  padding: 20px;
  overflow-x: scroll;
  margin-bottom: 44px;
}

.definitionContainer {
  margin-bottom: 20px;
}

.definitionContainer:has(.typeP) {
  border-top: 1px solid slategray;
}

.synonymsDiv {
  margin-top: 15px;
}

.synonym {
  color: var(--coolblue);
  text-decoration: none;
  padding: 4px 6px;
  margin-right: 5px;
  border: 1.5px solid slategray;
  border-radius: 20px;
}

#dictionaryCard p {
  margin: 10px 0;
}

#dictionaryCard ul {
  font-size: 1.05em;
  margin-top: 20px;
  padding-left: 40px;
}

.example {
  color: darkgray;
  font-size: 1em
}

.example:not(:empty)::before {
  content: "\\"";
}

.example:not(:empty)::after {
  content: "\\"";
}

#pronounciationDiv {
  display: flex;
  align-items: center;
}

#pronounciationImgBtn {
  padding: 0;
  height: 36px;
  width: 36px;
  background-color: var(--coolblue);
  border: 0;
  border-radius: 20px;
  cursor: pointer;
}

p#wordP {
  font-size: 28px;
  margin-left: 10px;
}
`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

export default createDictionaryCard;