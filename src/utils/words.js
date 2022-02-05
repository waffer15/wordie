import words from './constants';

class Words {
    constructor() {
        this.words = words;
        this.shuffle();
    }

    static isValidWord(word) {
        console.log('ww', words.includes(word))
        return words.includes(word);
    }

    shuffle() {
        let currentIndex = this.words.length;
        let randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [this.words[currentIndex], this.words[randomIndex]] = [
            this.words[randomIndex], this.words[currentIndex]];
        }
    }

    randomWord(letters) {
        const candidates = this.words.filter((word) => word.length === letters);
        return this.chooseRandomWord(candidates);
    }

    chooseRandomWord(wordList) {
        return wordList[Math.floor(Math.random() * wordList.length)];
    }
}

export default Words;