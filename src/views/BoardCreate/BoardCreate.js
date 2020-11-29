import template from "./BoardCreate.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import LabeledToggle from "../../components/Toggle/LabeledToggle/LabeledToggle.js";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";


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
            id: 'description',
        }));
        elements.push(new LabeledToggle({
            label: 'Сделать доску приватной?',
            small: 'Другие пользователи не смогут увидеть ее',
            id: 'private',
        }));
        elements.push(new Button({
            id: 'submit',
            type: 'submit',
            text: 'Создать'
        }));

        const form = new FormGenerator('Board-creating', ...elements).createForm();

        const data = {
            form: form.render()
        }

        this.fillWith(data);
        super.render()

        form.bind('submit', (event) => {
            let data = {};
            data['title'] = document.getElementById('title').value;
            data['description'] = document.getElementById('description').value;
            data['private'] = form.getElement('private').value;

            eventBus.emit(Events.boardCreating, {event: event, ...data});
        })
    }
}