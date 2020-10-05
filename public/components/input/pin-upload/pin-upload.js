import Input from "../input.js";

export default class PinUpload extends Input {
    constructor(context = {}) {
        super(context)
        this.template = Handlebars.templates['pin-upload.hbs'];
    }

    render() {
        return super.render()
    }
}