<template>
  <div class="game-container">
    <transition name="fade">
      <Popup v-if="showPopup" :items="popupItems" :answer="word" :allItems="items"/>
    </transition>
    <div class="word-grid">
        <Grid v-if="ready" :items="items" :width="word.length" />
    </div>
    <div class="invalid-word-message" :class="{ 'fade-animation': invalidWord }"> Invalid Word </div>
    <div class="keyboard-container">
      <Keyboard class="keyboard" @onKeyPress="handleKeyPress" :updateButtonClasses="buttonClasses"/>
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
      this.items = Array.from({length: numLetters * this.attempts }, () => { return { color: 'grey', content: '' }});
      this.ready = true;
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
      console.log(guess);
      if (!Word.isValidWord(guess)) {
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
      
      if (guess === this.word) {
        setTimeout(() => {
          this.showPopup = true;
          this.popupItems = this.items.slice(start, end);
        }, 1000);
      } else if (this.currentAttempt + 1 === this.attempts) {
        setTimeout(() => {
          this.showPopup = true;
        }, 1000);
      }
      this.setButtonColors(this.items.slice(start, end));
      this.currentAttempt += 1;
      this.currentPosition = 0;
    },
    setButtonColors(guessArray) {
      const newButtonClasses = this.buttonClasses;
      for (let item of guessArray) {
        let remove = false
        if (newButtonClasses.green?.indexOf(item.content.toUpperCase()) > -1) {
          remove = true;
        }
        if (newButtonClasses.orange?.indexOf(item.content.toUpperCase()) > -1) {
          if (remove) {
            newButtonClasses.orange.replace(item.content.toUpperCase(), '');
          } else {
            remove = true;
          }
        }
        if (newButtonClasses['dark-grey']?.indexOf(item.content.toUpperCase()) > -1) {
          if (remove) {
            newButtonClasses['dark-grey'].replace(item.content.toUpperCase(), '');
          }
        }
        if (newButtonClasses[item.color]?.indexOf(item.content.toUpperCase()) > -1) {
          continue;
        }
        this.buttonClasses[item.color] = newButtonClasses[item.color]?.length ? newButtonClasses[item.color] + ` ${item.content.toUpperCase()}` : item.content.toUpperCase();
      }
      this.buttonClasses = newButtonClasses;
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
  margin-top: 1rem;
  opacity: 0;
  font-size: 1.5rem;
  color: #722222;
}

@keyframes fade {
  0% { opacity: 1 }
  50% { opacity: 1 }
  100% { opacity: 0 }
}
</style>
