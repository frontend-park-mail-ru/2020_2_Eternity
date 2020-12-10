import template from "./FileUpload.hbs"

import BaseComponent from "../BaseComponent.js";

export default class FileUpload extends BaseComponent {

    constructor(context = {}) {
        super(template, context);
    }

    get value() {
        return this.element.querySelector('input[type="file"]').files[0];
    }

    clear() {
        this.element.querySelector('input[type="file"]').value = '';
    }
}