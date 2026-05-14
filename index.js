const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/"
const wordToDefine = document.getElementById("user-input");
const results = document.getElementById("results");
const definitionList = document.getElementById("definitions")
const searchButton = document.getElementById("search")


searchButton.addEventListener("click", async () => {
    results.innerHTML = "" // Clear everything in results when the button is clicked

    // Make sure a word was typed in the input box
    if (wordToDefine.value == ""){
        console.log("Please type a word")
    }
    else {
        try {
            const response = await pullData(wordToDefine.value);
            wordToDefine.value = ""
            displayData(response);
        }
        catch (error) {
            wordToDefine.value = "";
            console.error(error)
        }
    }
});

// Function to fetch the data from the API 
async function pullData(word) {
    return fetch(dictionaryAPI + word)
        .then(response => {
            if (!response.ok) {
                throw new Error("Bad request")
            }
            return response.json()
        });
};

// Function for the logic of displaying the data
function displayData(data) {

    // Loop through the returned data for each word
    data.forEach(words => {
        const definedWord = document.createElement("h3");
        definedWord.textContent = `${words.word} - ${words.phonetic}`;
        results.append(definedWord);
        
        // Loop through all the word's meanings
        words.meanings.forEach(meaning => {
            const partsOfSpeech = document.createElement("h4");
            const unorderedList = document.createElement("ol");
            partsOfSpeech.textContent = meaning.partOfSpeech;
            results.append(partsOfSpeech);
            results.append(unorderedList);

            // Loop through all definitions under meanings
            meaning.definitions.forEach(definition => {
                const description = document.createElement("li");
                description.textContent = definition.definition;
                unorderedList.append(description);
            });
        });
    });
}