import template from "./BoardCreate.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import LabeledToggle from "../../components/Toggle/LabeledToggle/LabeledToggle.js";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Validator from "../../modules/tools/Validator";


export default class BoardCreate extends BaseView {
    constructor(context = {}) {
        super('Создать доску', context, null);
        this.template = template;
    }

    render() {
        const fieldsLabels = {
            title: 'Название',
            description: 'Описание'
        }

        const title = new Input({
            label: fieldsLabels.title,
            type: 'text',
            customClasses: 'form__input',
            value: this.context.title,
            id: 'title'
        }, Validator.validateEmptyField);
        const description = new Textarea({
            label: fieldsLabels.description,
            rows: 7,
            class: 'form__input input-group__field_noresize',
            id: 'description',
        });
        const createBtn = new Button({
            id: 'submit',
            type: 'submit',
            text: 'Создать',
            customButton: 'btn_green'
        });
        const form = new FormGenerator('Board-creating', ...[title, description, createBtn]).createForm();

        const data = {
            form: form.render()
        }

        this.fillWith(data);
        super.render()

        form.bind('submit', (event) => {
            event.preventDefault();
            let data = {};
            let ok = true;

            form.elements.forEach((element) => {
                if (element instanceof Input && element.validator) {
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
                };
                eventBus.emit(Events.boardCreating, {event: event, ...data});
            }
        })
    }
}