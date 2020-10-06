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

        const form = new FormGenerator('', '', 'upload')

        form.appendElement(new PinUpload())

        form.appendInput('text', 'form__input', '', fieldsLabels['title'], '', 'title')
        form.appendInput('textarea', 'form__input','', fieldsLabels['description'], '', 'description')

        form.appendButton('submit', 'Создать')

        const data = {
            form: form.renderAll(),
        }

        this.fillWith(data);
        super.render()

        let resultForm = form.fill();

        resultForm.bind('submit', (event) =>{
            event.preventDefault();

            let data = {};
            data['file'] = document.getElementById('file').files[0];
            data['title'] = document.getElementById('title').value;
            data['description'] = document.getElementById('description').value;

            // TODO: AJAX
        })
    }
}