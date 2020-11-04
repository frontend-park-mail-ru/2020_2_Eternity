import template from "./settings.hbs"

import Base from "../base.js";

import Avatar from "../../components/avatar/avatar.js";
import FileUpload from "../../components/input/file-upload/file-upload.js";
import Navbar from "../../components/navbar/navbar.js";
import Input from "../../components/input/input.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Validator from "../../modules/tools/validator.js"
import eventBus from "../../modules/tools/eventBus.js";
import {Events} from "../../modules/consts/events.js";


export default class SettingsPage extends Base {
    constructor(context = {}) {
        super('Редактирование профиля', context, null);
        this.template = template;
    }

    render() {
        const navbar = new Navbar();

        const fieldsLabels = {
            name: 'Имя',
            surname: 'Фамилия',
            username: 'Имя пользователя',
            description: 'Сведения о вашем профиле',
            fileUpload: 'Выбрать аватар',
            email: 'email'
        }

        const form = new FormGenerator('', '', 'edit')

        form.appendElement(new Avatar({
            imgSrc: this.context.avatarPath,
        }))

        const fileUpload = new FileUpload({
            label: fieldsLabels.fileUpload,
        })
        form.appendElement(fileUpload);

        form.appendInput('text', 'form__input', fieldsLabels['name'], '', this.context.name, 'name')
        form.appendInput('text', 'form__input', fieldsLabels['surname'], '', this.context.surname, 'surname')
        form.appendInput('text', 'form__input', fieldsLabels['username'], '', this.context.username, 'username')
        form.appendInput('email', 'form__input', fieldsLabels['email'], '', this.context.email, 'email')
        form.appendInput('text', 'form__input', fieldsLabels['description'], '', this.context.description, 'description')
        // form.appendInput('password', 'form__input', 'Текущий пароль', '', '', 'oldpswd')
        // form.appendInput('password', 'form__input', 'Новый пароль', '', '', 'newpswd')

        form.appendButton('submit', 'Сохранить')

        const resultForm = form.fill()

        const data = {
            navbar: navbar.render(),
            form: form.renderAll()
        }

        this.fillWith(data);
        super.render()

        resultForm.bind('submit', (event) => {
            let values = {};
            resultForm.inputs.forEach((input) => {
                values[input.id] = input.value;
            })
            values.file = fileUpload.value;
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