export default class BaseComponent {
    context
    template

    constructor(template, context = {}) {
        this.context = context;
        this.template = template;
    }

    render() {
        return this.template(this.context)
    }

    get context() {
        return this.context;
    }

    get element() {
        return document.getElementById(this.context.id);
    }
}