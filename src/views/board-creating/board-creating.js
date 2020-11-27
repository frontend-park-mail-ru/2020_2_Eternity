import template from "./board-creating.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/input/input.js";
import Textarea from "../../components/input/textarea/textarea.js";
import LabeledToggle from "../../components/Toggle-NEEDRENAME/LabeledToggle/LabeledToggle.js";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";


export default class BoardCreating extends BaseView {
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