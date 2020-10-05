import Input from "../input.js";

export default class FileUpload extends Input {
    constructor(context = {}) {
        super(context)
        this.template = Handlebars.templates['file-upload.hbs'];
    }

    render() {
        return super.render()
    }
}