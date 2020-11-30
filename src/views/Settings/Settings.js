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



export default class SettingsPage extends BaseView {
    form;

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

        let elements = [];

        const avatar = new Avatar({
            img_link: this.context.avatar,
            id: this.context.username,
        });
        elements.push(new FileUpload({
            label: fieldsLabels.fileUpload,
        }));
        elements.push(new Input({
            label: fieldsLabels['username'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.username,
            id: 'username'
        }));
        elements.push(new Input({
            label: fieldsLabels['name'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.name,
            id: 'name'
        }));
        elements.push(new Input({
            label: fieldsLabels['surname'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.surname,
            id: 'surname'
        }));
        elements.push(new Input({
            label: fieldsLabels['email'],
            type: 'email',
            customClasses: 'form__input',
            value: this.context.email,
            id: 'email'
        }));
        elements.push(new Textarea({
            label: fieldsLabels.description,
            rows: 5,
            class: 'form__input',
            value: this.context.description,
            id: 'description',
        }));
        elements.push(new Input({
            label: fieldsLabels['oldPassword'],
            type: 'password',
            customClasses: 'form__input',
            value: this.context.oldPassword,
            id: 'oldPassword'
        }));
        elements.push(new Input({
            label: fieldsLabels['newPassword'],
            type: 'password',
            customClasses: 'form__input',
            value: this.context.newPassword,
            id: 'newPassword'
        }));
        elements.push(new Button({
            id: 'submit',
            type: 'submit',
            text: 'Сохранить'
        }));

        this.form = new FormGenerator('settings', ...elements).createForm();
        const data = {
            avatar: avatar.render(),
            form: this.form.render()
        }

        this.fillWith(data);
        super.render()

        this.form.bind('submit', (event) => {
            // TODO: Инпуты и информацию из них придется хранить отдельно;
            //       Вероятно, генератор форм не нужен;

            let values = {};
            this.form.elements.forEach((element) => {
                if (element instanceof Input || element instanceof Textarea) {
                    values[element.context.id] = element.element.value;
                }

                if (element instanceof FileUpload && element.value) {
                    let formData = new FormData();
                    formData.append('image', element.value);
                    values.file = formData;
                    values.localFile = element.value;
                }
            })
            eventBus.emit(Events.profileUpdate, {event: event, ...values});
        })
    }
}
