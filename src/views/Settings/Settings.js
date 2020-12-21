import template from "./Settings.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/Avatar/Avatar.js";
import FileUpload from "../../components/FileUpload/FileUpload.js";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import Validator from "../../modules/tools/Validator.js"
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import {Icons} from "../../modules/consts/icons";



export default class SettingsPage extends BaseView {
    form
    // for uploading and preview avatar
    avatar
    reset
    upload

    constructor(context = {}) {
        super('Редактирование профиля', context, null);
        this.template = template;
    }

    render() {
        const fieldsLabels = {
            name: 'Имя',
            surname: 'Фамилия',
            username: 'Имя пользователя',
            description: 'Сведения о вашем профиле',
            fileUpload: 'Выбрать аватар',
            email: 'Адрес электронной почты',
            oldPassword: 'Текущий пароль',
            newPassword: 'Новый пароль'
        }

        this.avatar = new Avatar({
            img_link: this.context.avatar,
            id: this.context.username,
        });
        this.upload = new FileUpload({
            id: 'avatarUpload',
            label: fieldsLabels.fileUpload,
        });
        const username = new Input({
            label: fieldsLabels['username'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.username,
            id: 'username'
        }, Validator.validateAlphaField);
        const name = new Input({
            label: fieldsLabels['name'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.name,
            id: 'name'
        }, Validator.checkAlphabetNum);
        const surname = new Input({
            label: fieldsLabels['surname'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.surname,
            id: 'surname'
        }, Validator.checkAlphabetNum)
        const email = new Input({
            label: fieldsLabels['email'],
            type: 'email',
            customClasses: 'form__input',
            value: this.context.email,
            id: 'email'
        }, Validator.validateEmailField)
        const description = new Textarea({
            label: fieldsLabels.description,
            rows: 5,
            class: 'form__input',
            value: this.context.description,
            id: 'description',
        }, Validator.checkAlphabetNum)
        const oldPassword = new Input({
            label: fieldsLabels['oldPassword'],
            type: 'password',
            customClasses: 'form__input',
            value: this.context.oldPassword,
            id: 'oldPassword'
        }, Validator.checkPassword)
        const newPassword = new Input({
            label: fieldsLabels['newPassword'],
            type: 'password',
            customClasses: 'form__input',
            value: this.context.newPassword,
            id: 'newPassword'
        }, Validator.checkPassword)
        const saveBtn = new Button({
            id: 'submit',
            type: 'submit',
            text: 'Сохранить',
            customButton: 'btn_green'
        });
        this.form = new FormGenerator('settings',
            ...[this.upload, username, name, surname, email, description, oldPassword, newPassword, saveBtn]).createForm();

        this.reset = new Button({
            id: 'reset',
            customButton: 'btn_round btn_round_mini btn_red image-upload__reset',
            text: Icons.remove,
        })

        const data = {
            avatar: this.avatar.render(),
            reset: this.reset.render(),
            form: this.form.render()
        }

        this.fillWith(data);
        super.render()

        this.form.bind('submit', (event) => {
            event.preventDefault();
            let ok = true;
            let values = {};

            this.form.elements.forEach((element) => {
                if (element instanceof Input) {
                    element.checkValid();
                    if (element.hasError()) {
                        ok = false;
                    }
                }
            });

            if (ok) {
                this.form.elements.forEach((element) => {
                    if (element instanceof FileUpload && element.value) {
                        let formData = new FormData();
                        formData.append('image', element.value);
                        values.file = formData;
                        values.localFile = element.value;
                    }
                    values[element.context.id] = element.element.value;
                })
                eventBus.emit(Events.profileUpdate, {event: event, ...values});
            }
        })

        this.upload.element.addEventListener('change', this.onShowAvatarPreview);
        this.reset.element.addEventListener('click', this.onResetPreview);
    }
}
