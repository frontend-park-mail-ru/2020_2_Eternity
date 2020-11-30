import template from "./ImageUpload.hbs"

import BaseComponent from "../BaseComponent.js";
import Image from "./Image/Image";
import Input from "../Input-NEEDRENAME/Input";
import {Icons} from "../../modules/consts/icons";
import Button from "../Button-NEEDRENAME/Button";


export default class ImageUpload extends BaseComponent {
    img
    reset
    inputField
    uploadArea
    labelIcon
    labelText

    constructor(context = {}) {
        super(template, context);
        document.addEventListener('dragover', this.dragoverBind.bind(this));
        document.addEventListener('dragleave', this.dragleaveBind.bind(this));
        document.addEventListener('change', this.showPreviewBind.bind(this));
    }

    render() {
        this.img = new Image({
            id: 'preview',
            class: 'image-upload__img'
        });
        this.inputField = new Input({
            id: 'pinImageUpload',
            type: 'file',
            customInputGroup: 'image-upload__input',
            customInput: 'image-upload__input',
        })
        this.reset = new Button({
            id: 'reset',
            customButton: 'btn_round btn_round_mini btn_red image-upload__reset',
            text: Icons.remove,
        })
        this.reset.bindClickButtonListener(this.resetPreviewBind.bind(this), this.reset.context.id);

        this.context.img = this.img.render();
        this.context.input = this.inputField.render();
        this.context.reset = this.reset.render();
        return super.render();
    }

    resetPreviewBind() {
        if (this.uploadArea) {
            this.uploadArea.classList.remove('image-upload_error');
            this.reset.hide();
            this.img.clear();
            this.inputField.clear();
            this.labelIcon.innerHTML = Icons.upload;
            this.labelText.innerHTML = 'Нажмите или перетащите файл для загрузки';
        }
    }


    changeUploadAreaState(state) {
        if (state === 'error') {
            this.uploadArea.classList.add('image-upload_error');
            this.reset.hide();
            this.img.clear();
            this.inputField.clear();
            this.labelIcon.innerHTML = Icons.warning;
            this.labelText.innerHTML = 'Не удалось загрузить файл'
        }
        if (state === 'ok') {
            this.uploadArea.classList.remove('image-upload_error');
            this.reset.show();
            this.labelIcon.innerHTML = '';
            this.labelText.innerHTML = '';
        }
    }

    checkTargetForDrag(event) {
        if (event.target instanceof HTMLElement && event.target.closest('.image-upload__wrap')) {
            this.uploadArea = this.element;
            this.labelIcon = this.uploadArea.querySelector('.image-upload__label__icon');
            this.labelText = this.labelIcon.nextElementSibling;
            return true;
        }
        return false;
    }

    dragoverBind(event) {
        console.log(event.target)
        if (this.checkTargetForDrag(event)) {
            this.uploadArea.classList.add('image-upload_dropping');
        }
    }
    dragleaveBind(event) {
        if (this.checkTargetForDrag(event)) {
            this.uploadArea.classList.remove('image-upload_dropping');
        }
    }
    showPreviewBind(event) {
        if (this.checkTargetForDrag(event)) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                this.img.show(evt.target.result);
                this.reset.show();
            };
            const file = this.inputField.files[0];
            if (file && file.type.match('image.*')) {
                reader.readAsDataURL(file);
                this.changeUploadAreaState('ok');
            } else {
                this.changeUploadAreaState('error')
            }
        }
    }
}