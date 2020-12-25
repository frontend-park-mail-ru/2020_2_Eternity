import template from "./CreateForm.hbs"

import BaseComponent from "../BaseComponent.js";

import Button from "../Button/Button";
import Textarea from "../Textarea/Textarea";
import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Image from "../Image/Image";

export default class CreateForm extends BaseComponent {
    title
    description
    btnCreate

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.pinImg = new Image({
            src: '/img/img11.jpg',
            id: this.context.pin_id,
            class: 'create-board-form__pin__img',
        })

        this.title = new Input({
            id: 'titleCreateBoard',
            label: 'Название доски',
        })

        this.description = new Textarea({
            label: 'Описание доски',
            rows: 5,
            id: 'descriptionCreateBoard',
            customInput: 'input-group__field_noresize'
        })

        this.btnCreate = new Button({
            id: 'createBoardBtn',
            text: 'Создать доску',
            customButton: 'btn_green'
        })

        this.context = {
            ...this.context,
            pinImg: this.pinImg.render(),
            title: this.title.render(),
            description: this.description.render(),
            btnCreate: this.btnCreate.render()
        }
        return super.render();
    }

    getCheckedProblems() {
        let res = [];
        this.checksElems.forEach((el) => {
            el.isChecked() ? res.push(el.element.getAttribute('id')) : ''
        })
        return res;
    }

}