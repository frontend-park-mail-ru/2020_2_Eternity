import template from "./Button.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Button extends BaseComponent {
    button
    states
    currentState
    stateNum

    constructor(context = {}, states={}) {
        super(template, context);
        this.states = {};
        Object.entries(states).forEach(([key, value]) => {
            this.states[key] = value;
        })
        this.init();
    }

    init() {
        if (Object.keys(this.states).length !== 0) {
            const [key, props] = Object.entries(this.states)[0];
            this.context.text = props.text;
            this.context.customButton = props.color;
            this.currentState = this.states[key];
            this.stateNum = 0;
        }
    }

    changeBtnText(text) {
        this.context.text = text;
        if (this.element) {
            this.element.innerText = text;
        }
    }
    changeBtnColor(colorClass) {
        if (!this.context.customButton) {
            this.context.customButton = '';
        }
        if (colorClass) {
            this.context.customButton.includes(colorClass) ?
                this.context.customButton.replace(colorClass, '') : this.context.customButton += colorClass;

            if (this.element) {
                this.element.classList.contains(colorClass) ? this.element.classList.remove(colorClass) : this.element.classList.add(colorClass);
            }
        }
    }
    changeDisabled() {
        if (this.element) {
            this.element.disabled = !this.button.disabled;
        }
    }

    changeBtnStateSequentially() {
        this.stateNum = (this.stateNum + 1) % Object.keys(this.states).length;
        this.changeBtnState(this.states[Object.keys(this.states)[this.stateNum]]);
    }

    changeBtnState(state) {
        if (this.currentState !== state) {
            this.changeBtnText(state.text);
            this.changeBtnColor(this.currentState.color);
            this.changeBtnColor(state.color);
            this.currentState = state;
        }
    }

    show() {
        if (this.element) {
            this.element.style.opacity = '1';
        }
    }
    hide() {
        if (this.element) {
            this.element.style.opacity = '0';
        }
    }
}