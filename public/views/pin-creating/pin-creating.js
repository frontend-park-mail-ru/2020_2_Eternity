import Base from "../base.js";

import PinUpload from "../../components/input/pin-upload/pin-upload.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Request from "../../modules/request/request.js";
import {router} from "../../index.js";

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

        form.elements[0].bindPreview();
        let resultForm = form.fill();

        resultForm.bind('submit', (event) =>{
            event.preventDefault();

            let data = {};
            data['title'] = document.getElementById('title').value;
            data['description'] = document.getElementById('description').value;

            let formData = new FormData()
            formData.append('img', document.getElementById('file').files[0])
            formData.append('data', JSON.stringify(data))

            Request.pinPost(formData).then((response) => {
                console.log(response.status)
                router.open('/')
            })

            // TODO: AJAX

        })
    }
}