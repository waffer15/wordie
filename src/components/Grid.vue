<template>
  <div class="grid-container" :style="gridStyle">
      <GridItem v-for="(item, index) in items" :key="index" v-bind="item" />
  </div>
</template>

<script>
import GridItem from './GridItem.vue';

export default {
  name: 'Grid',
  components: { GridItem },
  props: {
    width: { type: Number, required: true },
    items: { type: Array, required: true },
  },
  computed: {
      gridStyle() {
          return `grid-template-columns: repeat(${this.width}, 1fr)`;
      },
  },
}
</script>


<style scoped>
.grid-container {
    display: grid;
    grid-row-gap: 0.5em;
    grid-column-gap: 1em;
    height: 100%;
}
</style>
