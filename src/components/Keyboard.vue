<template>
  <div class="simple-keyboard"></div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String,
    },
    input: {
      type: String,
    },
    updateButtonClasses: { type: Object, default: null },
  },
  data: () => ({
    keyboard: null,
  }),
  mounted() {
      let keyboard = new Keyboard({
        onChange: input => this.onChange(input),
        onKeyPress: button => this.onKeyPress(button),
        theme: "hg-theme-default hg-layout-default custom-theme",
        layout: {
            default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{enter} Z X C V B N M {bksp}",
            ],
        },
        buttonTheme: [
            {
                class: 'custom-button',
                buttons: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
            },
            {
                class: 'enter-button',
                buttons: '{enter}',
            },
            {
                class: 'backspace-button',
                buttons: '{bksp}',
            },
        ],
        display: {
            '{bksp}': ' ',
            '{enter}': 'Enter',
        },
      });
      this.keyboard = keyboard;
  },
  methods: {
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
        this.$emit("onKeyPress", button);
    },
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    },
    updateButtonClasses: {
      deep: true,
      handler(to) {
        if (!to) {
          return;
        }

        for (let buttonClass of Object.keys(to))  {
          if (to[buttonClass]?.length) {
            this.keyboard.removeButtonTheme(to[buttonClass], 'green orange dark-grey');
            this.keyboard.addButtonTheme(to[buttonClass], buttonClass);
          }
        }
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:deep(.custom-button) {
    background-color: #353535;
    color: white;
    user-select: none;
    touch-action: manipulation;
    -ms-touch-action: manipulation;
}

:deep(.green) {
  background-color: #3ab352;
}

:deep(.dark-grey) {
  background-color: #7c7c7c;
}

:deep(.orange) {
  background-color: #f7b729;
}

:deep(.hg-row) {
  touch-action: manipulation;
  -ms-touch-action: manipulation;
}

:deep(.hg-rows) {
  touch-action: manipulation;
  -ms-touch-action: manipulation;
}

.custom-theme {
    user-select: none;
    position: absolute;
    bottom: 0;
    background-color: #1e1e1e;
    margin-bottom: 0.5rem;
    touch-action: manipulation;
    max-width: 35rem;
}

:deep(.backspace-button) {
  background: url('../assets/backspace.svg');
  background-repeat: no-repeat;
  background-color: #353535;
  color: white;
  width: 2rem;
  background-position: center;
  background-size: 1.6rem;
}

:deep(.enter-button) {
  background-color: #353535;
  color: white;
}

</style>
