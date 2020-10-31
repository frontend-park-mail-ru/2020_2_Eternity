export default class BaseComponent {
    context
    template

    constructor(template, context = {}) {
        this.context = context;
        this.template = Handlebars.templates[template];
    }

    render() {
        return this.template(this.context)
    }
}