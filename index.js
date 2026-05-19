const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const wordToDefine = document.getElementById("user-input");
const resultWord = document.getElementById("result-word");
const results = document.getElementById("results");
const definitionList = document.getElementById("definitions");
const searchButton = document.getElementById("search");
const synonymList = document.getElementById("synonyms");
const synonymGroup = document.getElementById("synonym-group");
const playButton = document.getElementById("play-button");
const emptyInput = document.getElementById("no-word");
const errorMessage = document.getElementById("error-message");


// Event handler for clicking button
searchButton.addEventListener("click", async (event) => {
    await handleEvents(event);
});

// Event handler for pressing enter
wordToDefine.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        await handleEvents(event);
    }
});

// Clear input field upon load
window.onload = function () {
    wordToDefine.value = ""
}

// Function to handle events
async function handleEvents(event) {
    resultWord.textContent = "";
    definitionList.innerHTML = "";
    synonymList.innnerHTML = "";
    synonymGroup.innerHTML = "";
    playButton.classList.add("d-none")
    errorMessage.classList.add("d-none")
    emptyInput.classList.add("d-none")

    // Make sure a word was typed in the input box
    if (wordToDefine.value == "") {
        emptyInput.textContent = "Please input word to search definition";
        emptyInput.classList.remove("d-none")
    } 
    else {
        try {
            const response = await pullData(wordToDefine.value);
            displayData(response);
            wordToDefine.value = "";
        } 
        catch (error) {
            emptyInput.textContent = ""
            errorMessage.classList.remove("d-none")
            errorMessage.textContent = error
            results.append(errorMessage)
            wordToDefine.value = "";
        }
    }
}

// Function to fetch the data from the API 
async function pullData(word) {
    return fetch(dictionaryAPI + word)
        .then(response => {
          if (!response.ok) {
            throw new Error("Bad request");
          }
          return response.json();
        });
};

// Function for the logic of displaying the data
function displayData(data) {
    emptyInput.textContent = ""
    errorMessage.textContent = ""
    
    // Loop through the returned data for each word
    data.forEach(words => {
        resultWord.textContent = `${words.word} - ${words.phonetic}`;

        // Pull the audio
        const wordWithAudio = words.phonetics.find(word => word.audio);

        if (wordWithAudio) {
            // Add the audio
            playButton.classList.remove("d-none");
            resultWord.append(playButton);

            // Event listener for play button
            playButton.onclick = () => {
                const pronunciation = new Audio(wordWithAudio.audio);
                pronunciation.play();
            };
        }

        // Loop through all the word's meanings
        words.meanings.forEach((meaning) => {
            const partsOfSpeech = document.createElement("h5");
            const unorderedList = document.createElement("ul");
            partsOfSpeech.classList.add("m-2"); // Bootstrap - add margin of 2
            partsOfSpeech.textContent = meaning.partOfSpeech;
            definitionList.append(partsOfSpeech);
            definitionList.append(unorderedList);

            // Loop through all definitions under meanings
            meaning.definitions.forEach((definition) => {
            const description = document.createElement("li");
            description.textContent = definition.definition;
            unorderedList.append(description);
            });

            // Grab the synonyms
            meaning.synonyms.forEach((synonym, index) => {
            const altWords = document.createElement("li");
            altWords.setAttribute('id', 'list-item')
            altWords.classList.add("list-group-item", "mb-3");
            altWords.textContent = synonym;
            synonymList.append(altWords);
            });
        });
    });
    // Add "Synonym" title above the list of synonyms if there are any synonyms
    if(synonymList.children.length > 0) {
        const synonymTitle = document.createElement("h5");
        synonymTitle.classList.add("m-2");
        synonymTitle.textContent = "Synonyms";
        synonymGroup.append(synonymTitle);
        synonymGroup.append(synonymList);
        results.append(synonymGroup);
    };
};