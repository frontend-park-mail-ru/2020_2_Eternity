import template from "./settings.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/Avatar/Avatar.js";
import FileUpload from "../../components/FileUpload/FileUpload.js";
import Input from "../../components/input/input.js";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import Validator from "../../modules/tools/Validator.js"
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Textarea from "../../components/input/textarea/textarea";


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

        elements.push(new Avatar({
            imgSrc: this.context.avatar,
            id: this.context.username,
        }));

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
            rows: 7,
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


        // form.appendInput('password', 'form__input', 'Текущий пароль', '', '', 'oldpswd')
        // form.appendInput('password', 'form__input', 'Новый пароль', '', '', 'newpswd')

        this.form = new FormGenerator('settings', ...elements).createForm();

        const data = {
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
