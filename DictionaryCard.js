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
  // i think i need to bypass cors for this yikes

  wordInfo.definitions.forEach((wordDefinition, index) => {
    const type = wordDefinition.type;
    const definition = wordDefinition.definition;
    const sentence = wordDefinition.sentence;
    const synonyms = wordDefinition.synonyms;

    const definitionContainer = document.createElement("div");
    definitionContainer.classList.add("definitionContainer");
    dictionaryCard.appendChild(definitionContainer);
    // may have to do some renaming

    // if its a different type than the last definition
    if (
      (index =
        0 || (index > 0 && wordInfo.definitions[index - 1].type !== type))
    ) {
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
  --coolblue: rgb(153, 195, 255);
}

#dictionaryCard {
  border: 1px solid var(--coolblue);
  border-radius: 20px;
  padding: 20px;
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

#dictionaryCard p::first-letter {
    text-transform: capitalize;
}

#dictionaryCard li {
  font-size: 1.05em;
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
`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

export default createDictionaryCard;
