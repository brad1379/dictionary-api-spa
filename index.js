const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const wordToDefine = document.getElementById("user-input");
const results = document.getElementById("results");
const definitionList = document.getElementById("definitions");
const searchButton = document.getElementById("search");
const synonymList = document.getElementById("synonyms");
const synonymGroup = document.getElementById("synonym-group")

// Event handler for clicking button
searchButton.addEventListener("click", async (event) => {
    await handleEvents(event)
});

// Event handler for pressing enter
wordToDefine.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        await handleEvents(event);
    }
});

// Function to handle events
async function handleEvents(event) {
    results.innerHTML = ""; // Clear everything in results when the button is clicked

    // Make sure a word was typed in the input box
    if (wordToDefine.value == "") {
        console.log("Please type a word");
    } 
    else {
        try {
            const response = await pullData(wordToDefine.value);
            wordToDefine.value = "";
            displayData(response);
        } 
        catch (error) {
            wordToDefine.value = "";
            console.error(error);
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
          // <----------- TESTING ---------->
          open(
            dictionaryAPI + word,
            "popupWindow",
            "width=600, height=400, scrollbars=yes",
          ); // to see full json
          // <------------------------------>
          return response.json();
        });
};

// Function for the logic of displaying the data
function displayData(data) {

    // Loop through the returned data for each word
    data.forEach(words => {
        const definedWord = document.createElement("h3");
        
        // Pull the audio
        words.phonetics.forEach(sound => {
            console.log(sound.text)
            if (!sound.audio) {}
            else {
                definedWord.textContent = `${words.word} - ${sound.text}`;
                results.append(definedWord);

                const playButton = document.createElement("img")
                const buttonImage = document.createElement("img");
                playButton.src='assets/volume.png'
                playButton.classList.add("play-button")
                // playButton.replaceWith(buttonImage)
                definedWord.append(playButton)
    
                // Event listener for play button
                playButton.addEventListener("click", ()=> {
                    const pronunciation = new Audio(sound.audio);
                    pronunciation.play()
                })
            }
        });
        // Loop through all the word's meanings
        words.meanings.forEach(meaning => {
            const partsOfSpeech = document.createElement("h5");
            const unorderedList = document.createElement("ul");
            partsOfSpeech.classList.add("m-2") // Bootstrap - add margin of 2
            partsOfSpeech.textContent = meaning.partOfSpeech;
            results.append(partsOfSpeech);
            results.append(unorderedList);

            
            // Loop through all definitions under meanings
            meaning.definitions.forEach(definition => {
                const description = document.createElement("li");
                description.textContent = definition.definition;
                unorderedList.append(description);
            });
            
            // Grab the synonyms
            meaning.synonyms.forEach((synonym, index) => {
                // Add "Synonym" title above the list of synonyms if there are any synonyms
                if(index === 0){
                    const synonymTitle = document.createElement("h5");
                    synonymTitle.classList.add("m-2");
                    synonymTitle.textContent = "Synonyms";
                    synonymGroup.append(synonymTitle);
                    results.append(synonymGroup)
                }
                const altWords = document.createElement("li");
                altWords.classList.add("list-group-item")
                altWords.classList.add("mb-3")
                altWords.textContent = synonym;
                synonymList.append(altWords)
                synonymGroup.append(synonymList)
                results.append(synonymGroup)
            });
        });
    });
};