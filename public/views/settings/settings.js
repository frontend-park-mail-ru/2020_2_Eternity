import Base from "../base.js";

import Avatar from "../../components/avatar/avatar.js";
import FileUpload from "../../components/input/file-upload/file-upload.js";

import FormGenerator from "../../modules/tools/form_generator.js";

export default class SettingsPage extends Base {
    constructor(context = {}) {
        super('Редактирование профиля', context, null);
        this.template = Handlebars.templates['settings.hbs'];
    }

    render() {
        const response = {
            avatarPath: './././static/img/img15.jpg',
            name: 'Ruby',
            surname: 'Rhod',
            username: 'OHMYGOOSH',
            description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
        }

        const fieldsLabels = {
            name: 'Имя',
            surname: 'Фамилия',
            username: 'Имя пользователя',
            description: 'Сведения о вашем профиле',
            fileUpload: 'Выбрать аватар',
        }

        const form = new FormGenerator('')

        form.appendElement(new Avatar({
            avatarPath: response['avatarPath']
        }))
        form.appendElement(new FileUpload({
            label: fieldsLabels['fileUpload']
        }))

        form.appendInput('text', 'form__input', fieldsLabels['name'], '', response['name'])
        form.appendInput('text', 'form__input', fieldsLabels['surname'], '', response['surname'])
        form.appendInput('text', 'form__input', fieldsLabels['username'], '', response['username'])
        form.appendInput('text', 'form__input', fieldsLabels['description'], '', response['description'])

        form.appendButton('submit', 'Сохранить')

        const data = {
            form: form.renderAll(),
        }

        this.fillWith(data);
        super.render()
    }
}