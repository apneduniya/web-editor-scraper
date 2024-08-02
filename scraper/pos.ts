import posTagger, { type PosTaggedToken } from "wink-pos-tagger";


const tagger = new posTagger();


async function pos(text: string): Promise<PosTaggedToken[]> {
    /**
     * This function takes a string of text and returns an array of strings
     * representing the part of speech of each word in the text.
     * 
     * @param {string} text - The text to be tagged
     * @returns {Promise<string[]>} - An array of strings representing the part of speech of each word in the text.
     */

    return tagger.tagSentence(text)
}


function removeSpecialCharacterEntries(entries: string[]): string[] {
    /**
     * This function takes an array of strings and removes any string that contains special characters.
     * 
     * @param {string[]}
     * @returns {string[]} - An array of strings with no special characters.
     */
    
    const specialCharRegex = /[^a-zA-Z0-9\s-]/; // Regular expression to match any character that is not a letter, digit, space, or hyphen

    return entries.filter(entry => !specialCharRegex.test(entry));
}


const personNamePattern = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?$/; // Capitalized single or double words
const locationNamePattern = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?$/; // Capitalized single or double words
const allUppercasePattern = /^[A-Z\s]+$/; // Uppercase words (for cities or brands)

function isPersonName(word: string): boolean {
    return personNamePattern.test(word) || allUppercasePattern.test(word);
}

function isLocationName(word: string): boolean {
    return locationNamePattern.test(word) || allUppercasePattern.test(word);
}


// EXPORTED FUNCTIONS


async function getNNPs(text: string): Promise<string[]> {
    /**
     * This function takes a string of text and returns an array of strings
     * representing the nouns in the text.
     * 
     * @param {string} text - The text to be tagged
     * @returns {Promise<string[]>} - An array of strings representing the nouns in the text.
     */

    const tags = await pos(text);
    const nnp = tags.filter(tag => tag.pos === 'NNP');
    const filteredNNP = removeSpecialCharacterEntries(nnp.map(tag => tag.value));
    
    const personNames = filteredNNP.filter(isPersonName);
    const locationNames = filteredNNP.filter(isLocationName);
    
    return [...new Set([...personNames, ...locationNames])]; // Remove duplicates
}



export { getNNPs };



async function main() {
    const text = `

    Praxis Business School
    4.4
    291 Ratings
    Bakrahat Road Kolkata Gpo, Kolkata
    Colleges
    Institutes
    `;

    const tags = await getNNPs(text);
    console.log(tags);
}

main();


