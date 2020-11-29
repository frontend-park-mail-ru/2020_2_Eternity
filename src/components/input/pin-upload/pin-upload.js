import template from "./pin-upload.hbs"

import Input from "../input.js";
import BaseComponent from "../../BaseComponent.js";
import Image from "../_img/img.js";
import ResetIcon from "../_reset-icon/reset.js";


export default class PinUpload extends BaseComponent {
    img
    reset
    input

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.img = new Image({
            id: 'preview',
            class: 'Pin-creation__img',
        });
        this.input = new Input({
            type: 'file',
            id: 'file',
        });
        this.reset = new ResetIcon({
            id: 'reset-preview',
        })

        this.context = {
            img: this.img.render(),
            input: this.input.render(),
            reset: this.reset.render(),
        }

        return super.render();
    }

   // TODO: event  bus
    bindPreview() {
        this.input.element.addEventListener('change', evt => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.img.show(e.target.result);
                this.reset.show();
            };
            const file = this.input.element.files[0];
            if (file && file.type.match('image.*')) {
                reader.readAsDataURL(file);
            }
        });

        this.reset.element.addEventListener('click', (event) => {
            event.preventDefault();
            this.input.value = '';
            this.img.clear();
            this.reset.hide();
        });
    }
}