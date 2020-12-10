import template from "./PinCreate.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";


export default class PinCreate extends BaseView {
    upload

    constructor(context = {}) {
        super('Новый пин', context, null);
        this.template = template;
    }

    render() {
        const fieldsLabels = {
            title: 'Название',
            description: 'Описание'
        }

        this.upload = new ImageUpload({id: 'upload'});
        const title = new Input({
            label: fieldsLabels.title,
            type: 'text',
            customClasses: 'form__input',
            value: this.context.title,
            id: 'title'
        });
        const description = new Textarea({
            label: fieldsLabels.description,
            rows: 7,
            class: 'form__input',
            value: this.context.description,
            id: 'description'
        });
        const createBtn = new Button({
            id: 'submit',
            type: 'submit',
            text: 'Создать'
        });
        const form = new FormGenerator('PinCreate', ...[title, description, createBtn]).createForm();

        const data = {
            pinUpload: this.upload.render(),
            form: form.render(),
        }

        this.fillWith(data);
        super.render()

        form.bind('submit', (event) => {
            event.preventDefault();
            let data = {};
            data['title'] = title.value;
            data['description'] = description.value;
            //data = JSON.stringify(data);
            data['file'] = document.getElementById('pinImageUpload').files[0];

            eventBus.emit(Events.pinCreating, {event: event, ...data});
        })

        this.upload.reset.element.addEventListener('click', this.onResetPreview);
        this.upload.element.addEventListener('dragover', this.onDragover);
        this.upload.element.addEventListener('dragleave', this.onDragleave);
        this.upload.element.addEventListener('change', this.onShowPreview);
    }
}