export default class Avatar {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = Handlebars.templates['avatar.hbs'];
    }

    render() {
        return this.template(this.context)
    }
}