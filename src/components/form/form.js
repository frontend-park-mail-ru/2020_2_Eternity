import template from './form.hbs'

export default class Form {
    context
    template

    constructor(context = {}) {
        this.context = context;
        this.template = template;
    }

    render() {
        return this.template(this.context)
    }

    get element() {
        return document.getElementById(this.context.id)
    }

    get inputs() {
        let result = []
        this.context.inputs.forEach((input) => {
            result.push(document.getElementById(input))
        })

        return result
    }

    bind(event, callback) {
        this.element.addEventListener(event, callback)
    }
}