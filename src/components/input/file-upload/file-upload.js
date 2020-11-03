import template from "./file-upload.hbs"

import Input from "../input.js";

export default class FileUpload extends Input {
    constructor(context = {}) {
        super(template, context);
    }

    render() {
        const input = new Input({
            type: 'file',
            id: 'file',
        })

        this.context.input = input.render();
        return super.render()
    }
}