import template from "./settings.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/avatar/avatar.js";
import FileUpload from "../../components/input/file-upload/file-upload.js";
import Navbar from "../../components/navbar/navbar.js";
import Input from "../../components/input/input.js";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import Validator from "../../modules/tools/Validator.js"
import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Button from "../../components/button/button";


export default class SettingsPage extends BaseView {
    #form;

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
            email: 'email'
        }

        let elements = [];

        elements.push(new Avatar({
            imgSrc: this.context.avatarPath,
            id: 'avatar'
        }));

        elements.push(new FileUpload({
            label: fieldsLabels.fileUpload,
            id: 'file' // TODO: fix
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

        elements.push(new Input({
            label: fieldsLabels['description'],
            type: 'text',
            customClasses: 'form__input',
            value: this.context.description,
            id: 'description'
        }));

        elements.push(new Button({
            id: 'submit',
            type: 'submit',
            btnText: 'Сохранить'
        }));

        // form.appendInput('password', 'form__input', 'Текущий пароль', '', '', 'oldpswd')
        // form.appendInput('password', 'form__input', 'Новый пароль', '', '', 'newpswd')

        this.#form = new FormGenerator('settings', ...elements).createForm();

        const data = {
            form: this.#form.render()
        }

        this.fillWith(data);
        super.render()

        this.#form.bind('submit', (event) => {
            // TODO: Инпуты и информацию из них придется хранить отдельно;
            //       Вероятно, генератор форм не нужен;

            let values = {};
            this.#form.elements.forEach((element) => {
                if (element instanceof Input) {
                    values[element.context.id] = element.element.value;
                }

                if (element instanceof FileUpload) {
                    values.file = element.value
                }
            })
            eventBus.emit(Events.profileUpdate, {event: event, ...values});
        })
    }
}


// resultForm.bind('submit', (event) =>{
//     event.preventDefault();
//
//     let data = {};
//     let OK = true;
//     resultForm.inputs.forEach((input) => {
//         input.resetError();
//         let res = Validator.isValid(input.id, input.value)
//         if (res !== undefined && !res.res) {
//             input.addError(res.error)
//             OK = false;
//         }
//     })
//
//     if (OK) {
//         resultForm.inputs.forEach((input) => {
//             data[input.id] = input.value;
//         })
//     }
//
//     data['file'] = document.getElementById('file').files[0]
//     let formData = new FormData()
//     formData.append('image', document.getElementById('file').files[0])
//
//     Request.updateAvatar(formData).then((response) => console.log(response.status))
//
//     console.log(data['name'], data['email'])
//     Request.updateProfile(data['name'], data['email']).then((response) => console.log(response.status))
//     //Request.updatePassword(data['oldpswd'], data['newpswd']).then((response) => console.log(response.status))
//
// });