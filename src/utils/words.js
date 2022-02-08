import words from './constants';

const firstDay = '2/5/2022';

const seedrandom = require('seedrandom');
const curDate = new Date();
const seed = `${curDate.getUTCMonth() + 1}/${curDate.getUTCDate()}/${curDate.getUTCFullYear()}`
const seededRng = seedrandom(seed);

const dailyRandom = seededRng();

class Words {
    constructor() {
        this.words = words;
    }

    static isValidWord(word) {
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

    wordOfTheDay(letters = 5) {
        const candidates = this.words.filter((word) => word.length === letters);
        return candidates[Math.floor(dailyRandom * candidates.length)];
    }

    randomWord(letters) {
        this.shuffle();
        const candidates = this.words.filter((word) => word.length === letters);
        return this.chooseRandomWord(candidates);
    }

    chooseRandomWord(wordList) {
        return wordList[Math.floor(Math.random() * wordList.length)];
    }

    static getWordieNumber() {
        const date1 = new Date(firstDay);
        const date2 = new Date(seed);
    
        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;
    
        // Calculating the time difference between two dates
        const diffInTime = date2.getTime() - date1.getTime();
    
        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);
    
        return diffInDays + 1;
    }
}

export default Words;