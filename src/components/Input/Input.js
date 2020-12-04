import template from "./Input.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Input extends BaseComponent {
    field
    label
    error
    validator

    constructor(context = {}, validator) {
        super(template, context);
        this.validator = validator;
    }

    getHTML() {
        if (this.element) {
            [this.field, this.label, this.error] = this.element.parentNode.children;
        }
        return this;
    }

    checkValid() {
        this.getHTML();
        if (this.element) {
            this.resetError();
            const errors = this.validator(this.value);
            if (errors.length !== 0) {
                this.addError(errors[0])
            }
        }
    }

    addError(error) {
        if (this.error) {
            this.error.innerHTML = error;
            this.error.classList.add('error_show');
            this.field.classList.add('Input-group__field_error');
            this.label.classList.add('Input-group__label_error');
        }
    }
    resetError() {
        if (this.error) {
            this.field.classList.remove('Input-group__field_error');
            this.label.classList.remove('Input-group__label_error');
            this.error.classList.remove('error_show');
            this.error.innerHTML = '';
        }
    }

    hasError() {
        if (this.error) {
            return this.error.classList.contains('error_show');
        }
    }

    get value() {
        if (this.element) {
            return this.element.value;
        }
    }
    get files() {
        if (this.element && this.context.type === 'file') {
            return this.element.files;
        }
    }

    clear() {
        if (this.element) {
            this.element.value = '';
        }
    }
}
