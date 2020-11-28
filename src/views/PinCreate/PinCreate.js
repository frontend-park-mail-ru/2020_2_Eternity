import template from "./PinCreate.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input-NEEDRENAME/Input";
import Textarea from "../../components/Textarea-NEEDRENAME/Textarea";
import ImageUpload from "../../components/ImageUpload/ImageUpload";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Button from "../../components/Button-NEEDRENAME/Button";



export default class PinCreate extends BaseView {
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
            text: 'Создать'
        }));

        const form = new FormGenerator('PinCreate', ...elements).createForm();
        const data = {
            pinUpload: new ImageUpload({id: 'pinup'}).render(),
            form: form.render(),
        }

        this.fillWith(data);
        super.render()

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