import template from "./FileUpload.hbs"

import BaseComponent from "../BaseComponent.js";

export default class FileUpload extends BaseComponent {

    constructor(context = {}) {
        super(template, context);
    }

    get value() {
        return document.querySelector('Input[type="file"]').files[0];
    }
}