import template from "./Button.hbs"

import BaseComponent from "../BaseComponent.js";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";

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
        document.addEventListener('click', this.checkBtnLink.bind(this));
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
        if (this.button) {
            this.button.innerHTML = text;
        }
    }
    changeBtnColor(colorClass) {
        if (this.button) {
            if (colorClass) {
                this.button.classList.contains(colorClass) ? this.button.classList.remove(colorClass) : this.button.classList.add(colorClass);
            }
        }
    }
    changeDisabled() {
        if (this.button) {
            this.button.disabled = !this.button.disabled;
        }
    }

    checkBtnClick(event) {
        if (event.target instanceof HTMLElement && event.target.closest('.btn')) {
            event.preventDefault();
            this.button = event.target.closest('.btn');
            return true;
        }
        return false;
    }
    checkBtnLink(event) {
        if (this.checkBtnClick(event) && event.target.closest('[data-link]')) {
            const href = this.button.getAttribute('data-link');
            EventBus.emit(Events.pathChanged, {path: href})
        }
    }

    changeBtnStateSequentially(event) {
        if (this.checkBtnClick(event)) {
            this.stateNum = (this.stateNum + 1) % Object.keys(this.states).length;
            this.changeBtnState(this.states[Object.keys(this.states)[this.stateNum]]);
        }
    }

    changeBtnState(state) {
        if (this.currentState !== state) {
            this.changeBtnText(state.text);
            this.changeBtnColor(this.currentState.color);
            this.changeBtnColor(state.color);
            this.currentState = state;
        }
    }

    bindClickButtonListener(callback, idBinded) {
        document.addEventListener('click', (event) => {
            if (this.checkBtnClick(event)) {
                if (event.target.id === idBinded) {
                    callback();
                }
            }
        })
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