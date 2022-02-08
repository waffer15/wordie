<template>
  <div class="game-container">
    <transition name="fade">
      <Popup v-if="showPopup" :items="popupItems" :answer="word" :allItems="items" :attempts="attempts"/>
    </transition>
    <div class="word-grid">
        <Grid v-if="ready" :items="items" :width="word.length" />
    </div>
    <div class="invalid-word-message" :class="{ 'fade-animation': invalidWord }"> Not in word bank </div>
    <div class="keyboard-container">
      <Keyboard class="keyboard" @onKeyPress="handleKeyPress" :buttonClasses="buttonClasses"/>
    </div>
  </div>
</template>

<script>
import Grid from '../components/Grid.vue';
import Keyboard from '../components/Keyboard.vue';
import Popup from '../components/Popup.vue';
import Word from '../utils/words';

export default {
  name: 'Game',
  components: { Grid, Keyboard, Popup },
  props: {
    attempts: { type: Number, default: 6 },
  },
  data() {
    return {
      word: null,
      items: [],
      ready: false,
      currentAttempt: 0,
      currentPosition: 0,
      showPopup: false,
      popupItems: [],
      buttonClasses: {},
      invalidWord: false,
    };
  },
  created() {
    const encodedWord = this.$route.params.word;
    this.word = window.atob(encodedWord).toLowerCase();
    console.log(this.word);
    this.initGame();
  },
  methods: {
    initGame() {
      const numLetters = this.word.length;
      const saveObject = this.getSaveProgress();
      if (saveObject) {
        this.items = saveObject.items;
        this.currentAttempt = saveObject.currentAttempt;
        this.buttonClasses = saveObject.buttonClasses;
      } else {
        this.items = Array.from({length: numLetters * this.attempts }, () => { return { color: 'grey', content: '' }});
      }
      this.ready = true;
      
      this.checkGuess();
    },
    handleKeyPress(button) {
      const index = this.currentAttempt * this.word.length + this.currentPosition;
      
      if (button === '{bksp}') {
        this.handleBackspacePressed(index);
        return;
      }

      if (button === '{enter}') {
        this.handleEnterPressed();
        return
      }

      this.handleLetterPressed(index, button.toLowerCase());
    },
    handleBackspacePressed(index) {
      if (this.currentPosition == 0) return;
        this.items[index - 1].content = '';
        this.currentPosition -= 1;
        return;
    },
    handleLetterPressed(index, letter) {
      if (this.currentPosition === this.word.length) return;
    
      this.items[index].content = letter;
      
      this.currentPosition += 1;
    },
    handleEnterPressed() {
      if (this.currentPosition === this.word.length) {
        this.handleGuess();
      }
    },
    handleGuess() {
      // the start and end index of our guess
      const start = this.currentAttempt * this.word.length;
      const end = start + this.word.length;

      const guess = this.items.slice(start, end).map(item => item.content.toLowerCase()).join('');

      if (!this.$route.fullPath.includes('custom') && !Word.isValidWord(guess)) {
        this.invalidWord = true;
        setTimeout(() => {
          this.invalidWord = false;
        }, 2000);
        return;
      }

      const answerDict = {};
      const guessDict = {};

      // initialize the answer dict with the number of letters in the word for each char
      this.word.split('').forEach((c) => {
        if (!answerDict[c]) answerDict[c] = this.word.split(c).length - 1;
      });


      let curLetterInWord;
      let curLetterInGuess;

      // one pass to highlight all the correct letters
      for (let i = start; i < end; i += 1) {
        curLetterInWord = this.word[i % this.word.length];
        curLetterInGuess = this.items[i].content;

        if (!guessDict[curLetterInGuess]) guessDict[curLetterInGuess] = 0;
        if (curLetterInWord === curLetterInGuess) {
          guessDict[curLetterInGuess] += 1;
          this.items[i].color = 'green';
        }
      }

      // another pass to color the orange letters
      for (let i = start; i < end; i += 1) {
        curLetterInWord = this.word[i % this.word.length];
        curLetterInGuess = this.items[i].content;
        const indexInWord = this.word.indexOf(curLetterInGuess);

        if (this.items[i].color === 'grey') {
          this.items[i].color = 'dark-grey';
        }
        if (answerDict[curLetterInGuess] === guessDict[curLetterInGuess]) continue;

        if (indexInWord !== -1 && this.items[i].color !== 'green') {
          guessDict[curLetterInGuess] += 1;
          this.items[i].color = 'orange';
        }
      }

      this.setButtonColors(this.items.slice(start, end));
      this.currentAttempt += 1;
      this.currentPosition = 0;

      this.checkGuess();
      this.saveProgress();
    },
    setButtonColors(guessArray) {
      let { green, orange, 'dark-grey': grey } = this.buttonClasses;
      
      let curContent;

      for (let item of guessArray) {
        curContent = item.content.toUpperCase();

        if (item.color === 'green'  && (!green || green?.indexOf(curContent) < 0)) {
          green = green?.length ? `${green} ${curContent}` : curContent;
          // replace existing entries
          orange = orange?.length ? orange.replace(curContent) : orange;
          grey = grey?.length ? grey.replace(curContent) : grey;
        } else if (item.color === 'orange' && (!orange || orange?.indexOf(curContent) < 0)) {
          if (green?.indexOf(curContent) > -1) continue;

          orange = orange?.length ? `${orange} ${curContent}` : curContent;
          grey = grey?.length ? grey.replace(curContent) : grey;
        } else if (item.color === 'dark-grey' && (!grey || grey?.indexOf(curContent) < 0)) {
          if (green?.indexOf(curContent) > -1 || orange?.indexOf(curContent) > -1) continue;

          grey = grey?.length ? `${grey} ${curContent}` : curContent;
        }
      }
      this.buttonClasses = { green, orange, 'dark-grey': grey };
    },
    saveProgress() {
      const saveObject = {};
      saveObject.currentAttempt = this.currentAttempt;
      saveObject.items = this.items;
      saveObject.buttonClasses = this.buttonClasses;

      localStorage.setItem(this.word, JSON.stringify(saveObject));
    },
    getSaveProgress() {
      const storedSave = localStorage.getItem(this.word);

      if (!storedSave) {
        return null;
      }

      const saveObject = JSON.parse(storedSave);

      if (saveObject.currentAttempt == null || !saveObject.items || !saveObject.buttonClasses) {
        return null;
      }
      return saveObject;
    },
    checkGuess() {
      const start = (this.currentAttempt - 1) * this.word.length;
      const end = start + this.word.length;

      const guess = this.items.slice(start, end).map(item => item.content.toLowerCase()).join('');

      if (guess === this.word) {
        setTimeout(() => {
          this.showPopup = true;
          this.popupItems = this.items.slice(start, end);
        }, 1000);
      } else if (this.currentAttempt >= this.attempts) {
        setTimeout(() => {
          this.showPopup = true;
        }, 1000);
      }
    },
  },
}
</script>


<style scoped>
.word-grid {
  max-width: 30rem;
  padding: 1rem;
  margin-right: auto;
  margin-left: auto;
  aspect-ratio: 1;
}

.game-container {
  height: 100%;
  text-align: center;
}

.keyboard-container {
  height: 100%;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-animation {
    animation: fade 5s linear;
}

.invalid-word-message {
  opacity: 0;
  font-size: 1.2rem;
  background-color: #df5a5a;
  color: #adadad;
  border: solid 1px #000000;
  max-width: 60%;
  margin-left: auto;
  margin-right: auto;
  padding: 0.25rem;
}

@keyframes fade {
  0% { opacity: 0 }
  10% { opacity: 1 }
  90% { opacity: 1 }
  100% { opacity: 0 }
}
</style>
