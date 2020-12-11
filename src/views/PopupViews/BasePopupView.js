export default class BasePopupView {
    context
    template

    constructor(context = {}, template) {
        this.template = template;
        this.context = context;
    }

    render() {
        return this.template(this.context);
    }
}