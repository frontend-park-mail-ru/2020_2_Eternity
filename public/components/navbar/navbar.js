export default class Navbar {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = Handlebars.templates['navbar.hbs'];
    }

    render() {
        return this.template(this.context);
    }
}