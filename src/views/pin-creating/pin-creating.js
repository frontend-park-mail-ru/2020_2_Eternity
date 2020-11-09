import template from "./pin-creating.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/input/input.js";
import Button from "../../components/button/button.js";
import Textarea from "../../components/input/textarea/textarea.js";
import PinUpload from "../../components/input/pin-upload/pin-upload.js";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";


export default class PinCreating extends BaseView {
    constructor(context = {}) {
        super('Новый пин', context, null);
        this.template = template;
    }

    render() {
        const fieldsLabels = {
            title: 'Название',
            description: 'Описание'
        }

        let elements = [];

        elements.push(new PinUpload());
        elements.push(new Input({
            label: fieldsLabels.title,
            type: 'text',
            customClasses: 'form__input',
            value: this.context.title,
            id: 'title'
        }));

        elements.push(new Textarea({
            label: fieldsLabels.description,
            rows: 7,
            class: 'form__input',
            value: this.context.description,
            id: 'description'
        }));

        elements.push(new Button({
            id: 'submit',
            type: 'submit',
            btnText: 'Создать'
        }));

        const form = new FormGenerator('pin-creating', ...elements).createForm();

        const data = {
            form: form.render(),
        }

        this.fillWith(data);
        super.render()

        elements[0].bindPreview();

        form.bind('submit', (event) => {
            let data = {};
            data['title'] = document.getElementById('title').value;
            data['description'] = document.getElementById('description').value;
            //data = JSON.stringify(data);
            data['file'] = document.getElementById('file').files[0];

            eventBus.emit(Events.pinCreating, {event: event, ...data});
        })
    }
}