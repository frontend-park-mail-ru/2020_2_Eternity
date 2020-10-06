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

    get inputs() {
        let result = []
        this.context.inputs.forEach((input) => {
            result.push(document.getElementById(input))
        })

        return result
    }

    addError(parent, errMessage) {
        // TODO: сделать красиво :(
        let err = document.createElement('div');
        err.className = 'error';
        err.style.color = 'red';
        err.innerHTML = errMessage;
        parent.parentNode.insertBefore(err, parent)
    }

    removeErrors() {
        let errors = this.element.querySelectorAll('.error');
        errors.forEach((err) => {
            err.remove();
        })
    }

    bind(event, callback) {
        this.element.addEventListener(event, callback)
    }
}