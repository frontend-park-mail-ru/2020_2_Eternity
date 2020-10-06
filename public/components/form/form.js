export default class Form {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = Handlebars.templates['form.hbs'];
    }

    render() {
        return this.template(this.context)
    }

    get element() {
        return document.getElementById(this.context.id)
    }

    bind(event, callback) {
        this.element.addEventListener(event, callback)
    }
}