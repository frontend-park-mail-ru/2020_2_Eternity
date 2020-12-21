import template from "./PinCreate.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Validator from "../../modules/tools/Validator";


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
            value: this.context.title,
            id: 'title'
        }, Validator.validateAlphaField);
        const description = new Textarea({
            label: fieldsLabels.description,
            rows: 7,
            customInput: 'input-group__field_noresize',
            value: this.context.description,
            id: 'description'
        }, Validator.validateAlphaField);
        const createBtn = new Button({
            id: 'submit',
            type: 'submit',
            text: 'Создать',
            customButton: 'btn_green'
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
            let ok = true;
            let data = {};

            form.elements.forEach((element) => {
                if (element instanceof Input) {
                    element.checkValid();
                    if (element.hasError()) {
                        ok = false;
                    }
                }
            });

            if (ok) {
                data = {
                    title: title.value,
                    description: description.value,
                    file: document.getElementById('pinImageUpload').files[0],
                };
                eventBus.emit(Events.pinCreating, {event: event, ...data});
            }
        })

        this.upload.reset.element.addEventListener('click', this.onResetPreview);
        this.upload.element.addEventListener('dragover', this.onDragover);
        this.upload.element.addEventListener('dragleave', this.onDragleave);
        this.upload.element.addEventListener('change', this.onShowPreview);
    }
}