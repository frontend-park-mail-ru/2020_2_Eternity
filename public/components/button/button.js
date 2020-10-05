export default class Button {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = Handlebars.templates['button.hbs'];
    }

    render() {
        return this.template(this.context)
    }
}