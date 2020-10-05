import Base from "../base.js";

import PinUpload from "../../components/input/pin-upload/pin-upload.js";

import FormGenerator from "../../modules/tools/form_generator.js";

export default class PinCreating extends Base {
    constructor(context = {}) {
        super('Новый пин', context, null);
        this.template = Handlebars.templates['pin-creating.hbs'];
    }

    render() {
        const fieldsLabels = {
            title: 'Title',
            description: 'Pin description'
        }

        const form = new FormGenerator('')

        form.appendElement(new PinUpload())

        form.appendInput('text', 'form__input', '', fieldsLabels['title'])
        form.appendInput('textarea', 'form__input','', fieldsLabels['title'])

        form.appendButton('submit', 'Создать')

        const data = {
            form: form.renderAll(),
        }

        this.fillWith(data);
        super.render()
    }
}