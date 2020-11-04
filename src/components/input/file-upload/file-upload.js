import template from "./file-upload.hbs"

import Input from "../input.js";
import BaseComponent from "../../base_component.js";

export default class FileUpload extends BaseComponent {
    input

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.input = new Input({
            type: 'file',
            id: 'file',
        })

        this.context.input = this.input.render();
        return super.render()
    }

    get value() {
        return this.input.element.files[0];
    }
}