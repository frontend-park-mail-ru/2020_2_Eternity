export default class Card {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = Handlebars.templates['card.hbs'];
    }

    render() {
        return this.template(this.context)
    }
}