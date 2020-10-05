export default class Input {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = Handlebars.templates['input.hbs'];
    }

    render() {
        return this.template(this.context)
    }
}