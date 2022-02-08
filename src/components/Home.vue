<template>
  <div>
    <div class="tab-buttons">
      <button @click="tab = 'play'" :class="['tab-button', { active: tab === 'play' }]"> Play </button>
      <button @click="tab = 'create'" :class="['tab-button', { active: tab === 'create' }]"> Create </button>
    </div>
    <div v-if="tab === 'play'" class="play-tab">
      <p class="instructions"> Choose a Game </p>
      <div class="action-container">
          <button class="button" @click="clickButton('day')">
            Daily Wordie
          </button>
          <button class="button normal" @click="clickButton('normal')">
            5 Letters
          </button>
          <button class="button hard" @click="clickButton('hard')">
            6 Letters
          </button>
      </div>
    </div>
    <div v-else class="create-tab">
      <p class="instructions"> Create Wordie </p>
      <textarea
          class="text-input"
          v-model="customWord"
          placeholder="enter 4 - 7 letter word"
        ></textarea>
      <button class="generate-button" :disabled="disableGenerateButton" @click="generateWordie">
          Generate Wordie
      </button>
      <div class="game-link-container" v-if="gameLink">
        <div class="game-link-message">Share this link:</div>
        <input id="game-link" class="game-link" :value="gameLink"/>
      </div>
    </div>
  </div>
</template>

<script>
import randomWords from "random-words";
import { BASE_URL } from "../constants";
import Words from '../utils/words';

export default {
  name: "Hello",
  components: {},
  props: {
    msg: String,
  },
  data() {
    return {
      customWord: "",
      gameLink: false,
      showError: false,
      tab: 'play',
    };
  },
  computed: {
    disableGenerateButton() {
      return this.customWord.length < 4 || this.customWord.length > 7;
    },
  },
  methods: {
    clickButton(type) {
      const wordie = new Words();
      let word;
      let route;
      if (type === 'day') {
        word = wordie.wordOfTheDay();
        route = '/game/daily/';
      } else {
        const letters = type === 'normal' ? 5 : 6;
        word = wordie.randomWord(letters);
        route = '/game/';
      }
      
      const encodedWord = window.btoa(word);
      this.$router.push(`${route}${encodedWord}`);
    },
    generateWordie() {
      if (!this.disableGenerateButton) {
        const encodedWord = window.btoa(this.customWord);
        this.gameLink = `${BASE_URL}/game/custom/${encodedWord}`;
        this.$nextTick(() => {
          const input = document.getElementById('game-link');
          input.focus();
          input.select();
        });
      }
    },
    chooseWord() {
      let index = -1;
      let words;
      while (index === -1) {
        words = randomWords({ exactly: 10, maxLength: 6 });
        index = words.findIndex((word) => word.length == 5);
      }
      return words[index];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.instructions {
  margin: 50% 1rem 2rem 1rem;
  color: white;
  font-size: 1.25rem;
}

.action-container {
  color: white;
  text-align: -webkit-center;
  margin-top: 2rem;
}

.button {
  background-color: white;
  margin-top: 1rem;
  width: 15rem;
  border-radius: 1rem;
  height: 2.5rem;
  border: solid 1px;
  display: inherit;
  color: black;
}

.generate-button {
  background-color: white;
  margin: 1rem auto 0 auto;
  width: 9rem;
  border-radius: 1rem;
  height: 1.5rem;
  border: solid 1px;
  display: inherit;
  color: black;
}

.text-input {
  padding-top: 0.25rem;
  height: 1.25rem;
  width: 15rem;
  padding-left: 0.5rem;
}

.game-link-container {
  margin-top: 4rem;
}

.game-link-message {
  color: #8b8b8b;
  margin-bottom: 1rem;
}

.tab-button {
  width: 50%;
  height: 2rem;
  background-color: #454545;
  border: none; 
  color: black;
}

.active {
  background-color: white;
  box-shadow: 0px 0px 8px 0px #707070;
}
</style>
