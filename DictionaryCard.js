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
  //maybe since this isnt async can put it outside of the parent function and then call it in dictionarycard() after i load the card layout
  const word = wordInfo.word;
  const wordP = dictionaryCard.querySelector("#wordP");
  const pronounciationAudio = dictionaryCard.querySelector(
    "#pronounciationAudio",
  );

  wordP.textContent = word;
  pronounciationAudio.src = `https://translate.google.com/translate_tts?tl=en-US&client=t&q=${word}`;
  for (let wordDefinition of wordInfo.definitions) {
    const type = wordDefinition.type;
    // I DON'T USE THIS YET!!!!!!!!!
    const definition = wordDefinition.definition;
    const sentence = wordDefinition.sentence;
    const synonyms = wordDefinition.synonyms;

    const definitionContainer = document.createElement("div");
    definitionContainer.classList.add("definitionContainer");
    dictionaryCard.appendChild(definitionContainer);

    const definitionP = document.createElement("p");
    definitionP.textContent = definition;
    definitionContainer.appendChild(definitionP);

    const sentenceP = document.createElement("p");
    sentenceP.textContent = sentence;
    definitionContainer.appendChild(sentenceP);

    const synonymsDiv = document.createElement("div");
    definitionContainer.appendChild(synonymsDiv);

    for (let i = 0; i < 5; i++) {
      const synonymA = document.createElement("a");
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

export default createDictionaryCard;
