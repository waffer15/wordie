<template>
  <div class="grid-item" :class="{ 'spin-animation': animate }" :style="`background-color: ${itemColor}`">
      <div class="grid-content"> {{ content }} </div>
  </div>
</template>

<script>
export default {
  name: 'GridItem',
  props: {
    content: { type: String, default: '' },
    color: { type: String, default: 'grey' },
  },
  data() {
      return {
          animate: false,
      };
  },
  computed: {
    itemColor() {
        switch(this.color) {
            case 'dark-grey':
                return '#363636';
            case 'green':
                return '#3ab352';
            case 'orange':
                return '#f7b729';
            default:
                return '#1c1c1c';
        }
    },
  },
  watch: {
      color() {
          this.animate = true;
      },
  },
}
</script>


<style scoped>
.grid-item {
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 2rem;
    height: 100%;
    width: 100%;
    line-height: 0;
    box-shadow: inset 0 0 1px 1px #5b5b5b;
}

.spin-animation {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: 1;
  animation-timing-function: linear;
}

@keyframes spin {
    from {
        transform:rotateY(0deg);
    }
    to {
        transform:rotateY(360deg);
    }
}
</style>
