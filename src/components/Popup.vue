<template>
  <div class="popup-container">
      <h1> {{ title }} </h1>
      <div class="answer-grid">
          <Grid :items="gridItems" :width="gridItems.length" />
      </div>
      <button class="button" @click="$router.push('/')"> Back to Home </button>
      <button class="button" @click="shareLink"> Share this Wordie </button>
  </div>
</template>

<script>
import Grid from './Grid.vue';
import { BASE_URL } from '../constants';
import Word from '../utils/words';

export default {
  name: 'Popup',
  components: { Grid },
  props: {
      items: { type: Array, default: () => [] },
      answer: { type: String, default: '' },
      allItems: { type: Array, default: () => [] },
      attempts: { type: Number, default: 6 },
  },
  data() {
      return {
          dailyGame: this.$route.fullPath.includes('daily'),
      };
  },
  computed: {
      shareableMessage() {
          const grey = '⬛';
          const green = '🟩';
          const orange= '🟧';
          let won = false;
          let message = '';
          let allGreen = true;
          let count = 0;

          for (let i = 0; i < this.allItems.length; i += 1) {

              if (this.allItems[i].color === 'dark-grey') {
                  allGreen = false;
                  message += grey;
              } else if (this.allItems[i].color === 'orange') {
                  allGreen = false;
                  message += orange;
              } else {
                  message += green;
              }
              if (i !== 0 && (i + 1) % (this.answer.length) === 0) {
                  if (count < this.answer.length) {
                      count += 1;
                  }
                  if (allGreen) {
                        won = true;
                        break;
                  }
                  allGreen = true;
                  message += '\n';
              }
          }
          
          let startMessage;
          if (this.dailyGame && won) {
              startMessage = `Wordie #${Word.getWordieNumber()}   ${count} / ${this.attempts}`
          } else if (won) {
              startMessage = `Wordie   ${count} / ${this.attempts}`;
          } else {
              startMessage = `Wordie X / ${this.attempts}`
          }
          
          return `${startMessage} \n\n${message}`;
      },
      title() {
          if (this.items.length) return 'You guessed the word!';
          return 'You Lost!';
      },
      gridItems() {
          if (this.items.length) return this.items;
          return this.answer.split('').map((c) => { 
              return {
                  color: 'grey',
                  content: c,
              };
          });
      }
  },
  methods: {
      shareLink() {
          if (navigator.share) {
              navigator.share({
                  title: 'Play this Wordie',
                  text: this.shareableMessage,
                  url: `${BASE_URL}${this.$route.fullPath}`,
              });
          }
      }
  }
}
</script>


<style scoped>
.popup-container {
    position: absolute;
    height: 100%;
    background: rgba(32,32,32,0.95);
    z-index: 100;
    top: 0;
    color: white;
    width: 100%;
    max-width: 35rem;
}

.answer-grid {
    height: 4rem;
    margin: 2rem 1rem;
}

.button {
  background-color: white;
  margin: 1rem 0.5rem;
  width: 9rem;
  border-radius: 1rem;
  height: 2rem;
  border: solid 1px;
}
</style>
