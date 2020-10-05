export default class Base {
    context
    template
    #app

    constructor(title, context = {}, template) {
        document.title = title;
        this.context = context;
        this.template = template;
        this.#app = document.getElementById('app')
    }

    render() {
        this.#app.innerHTML = this.template(this.context)
    }

    clear() {
        this.#app.innerHTML = '';
    }

    set context(context) {
        this.context = context;
    }

    fillWith(...data) {
        data.forEach((obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                this.context[key] = value;
            })
        });
    }

}
