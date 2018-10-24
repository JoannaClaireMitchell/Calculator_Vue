Vue.component("num-button", {
  props: ["value", "label", "id", "display"],
  template: `
    <div class="grid-item">
      <label :for="id" class="sr-only">
        {{ label }}
      </label>
      <button type="button" class="btn-block" :value="value" :id="id" :title="label">
        <span v-html="display"></span>
      </button>
    </div>
  `
});

var app = new Vue({
  el: "#app",
  data: {
    sum: "",
    output: 0,
    calculated: false,
    icons: {
      backspace: '<i class="material-icons">backspace</i>'
    },
    characters: [
        { id: "9"},
        { id: "8"},
        { id: "7"},
        { id: "6"},
        { id: "5"},
        { id: "4"},
        { id: "3"},
        { id: "2"},
        { id: "1"},
        { id: "0", class: ['item-basis-2-3']},
        {id: "."}
    ],
    operators: {
      plus: {id: "+", value: "+", label: "plus", display: "&#43;"},
      minus: {id: "-", value: "-", label: "minus", display: "&#8722;"},
      divide: {id: "/", value: "/", label: "divide", display: "&#247;"},
      multiply: {id: "*", value: "*", label: "multiply", display: "&#215;"},
      exponent: {id: "**", value: "**", label: "exponent", display: "&#94;"}
    },
  },
  methods: {
    appendChar: function (character) {
      const newChar = character.id || character;
      this.inputValidation(character);
      return this.sum += newChar;
    },
    calculateSum: function(sum) {
      const doubles = sum.includes("++") ? "++" : sum.includes("--") ? "--" : null;

      if(sum.includes(doubles)){
        sum = sum.replace(doubles, '+');
      }
      if(sum.startsWith("0") && !sum.startsWith("0.")){
        while(sum.charAt(0) === '0'){
         sum = sum.substr(1);
        }
      }
      return this.output = Function('"use strict";return (' + sum + ')')();
    },
    displaySum: function(sum){
      if(sum !== ""){
        this.calculated = true;
        return this.sum = this.calculateSum(sum).toString();
      }
    },
    clearSum: function(){
      return this.sum = "";
    },
    undoChar: function(){
      let str = this.sum;
      return this.sum = str.substring(0, str.length - 1);
    },
    inputFocus: function(){
      this.$refs.input.focus();
    },
    inputValidation: function(character){
      const regOps = /\+|\-|\/|\*/;
      if(this.calculated === true && !regOps.test(character)){
        // if sum has just been calculated
        // and the next button pressed is not an operator, then sum gets cleared.
        this.clearSum();
      }
      this.calculated = false;
    }
  },
  mounted() {

    const thisApp = this;
    let inputField = thisApp.$refs.input;

    // TODO
    // copy and paste?

    window.addEventListener("keydown", function(event) {

        inputField.disabled = true;

        const eventKey = event.key || event.which;
        const eventCode = event.code;
        const charKey = eventKey.toString();
        const regex = /[0-9]|\.|\+|\-|\/|\*/;
        const sum = thisApp.sum;

        if (eventKey === 'Enter' || eventKey === "=") {
          // if a character key is focused, then don't call display sum.
          const focus = document.activeElement.value;

          if(!regex.test(focus)){
            thisApp.displaySum(sum);
          }

        }else if (regex.test(charKey)){

          thisApp.appendChar(charKey);

        }else if(charKey === "c" || charKey === "C"){

            thisApp.clearSum();

        }else if(eventCode === "Backspace"){

            thisApp.undoChar();

        }
    });
  }
});
