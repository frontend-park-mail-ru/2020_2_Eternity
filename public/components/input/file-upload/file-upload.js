import Input from "../input.js";

export default class FileUpload extends Input {
    constructor(context = {}) {
        super(context)
        this.template = Handlebars.templates['file-upload.hbs'];
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