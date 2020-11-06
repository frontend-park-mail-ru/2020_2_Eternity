import template from "./pin-creating.hbs"

import Base from "../base.js";

import PinUpload from "../../components/input/pin-upload/pin-upload.js";
import Navbar from "../../components/navbar/navbar.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Request from "../../modules/request/request.js";
import {router} from "../../index.js";
import eventBus from "../../modules/tools/eventBus.js";
import {Events} from "../../modules/consts/events.js";
import Avatar from "../../components/avatar/avatar";
import Input from "../../components/input/input";
import Button from "../../components/button/button";


export default class PinCreating extends Base {
    constructor(context = {}) {
        super('Новый пин', context, null);
        this.template = template;
    }

    render() {
        const navbar = new Navbar();
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

        elements.push(new Input({
            label: fieldsLabels.description,
            type: 'text',
            customClasses: 'form__input',
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
            navbar: navbar.render(),
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