import Base from "../base.js";

import Avatar from "../../components/avatar/avatar.js";
import FileUpload from "../../components/input/file-upload/file-upload.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Validator from "../../modules/tools/validator.js"
import Request from "../../modules/request/request.js";

export default class SettingsPage extends Base {
    constructor(context = {}) {
        super('Редактирование профиля', context, null);
        this.template = Handlebars.templates['settings.hbs'];
    }

    render() {
        Request.profile().then((response) => {
            console.log(response)
            return response.json()
        }).then((responseJSON) => {
            const profileData = {
                avatarPath: './././static/img/img15.jpg',
                name: responseJSON['username'],
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

            const form = new FormGenerator('', '', 'edit')

            form.appendElement(new Avatar({
                avatarPath: profileData['avatarPath']
            }))
            form.appendElement(new FileUpload({
                label: fieldsLabels['fileUpload']
            }))

            form.appendInput('text', 'form__input', fieldsLabels['name'], '', profileData['name'], 'name')
            form.appendInput('text', 'form__input', fieldsLabels['surname'], '', profileData['surname'], 'surname')
            form.appendInput('text', 'form__input', fieldsLabels['username'], '', profileData['username'], 'username')
            form.appendInput('text', 'form__input', fieldsLabels['description'], '', profileData['description'], 'description')

            form.appendButton('submit', 'Сохранить')

            const resultForm = form.fill()

            const data = {
                form: form.renderAll(),
            }

            this.fillWith(data);
            super.render()

            resultForm.bind('submit', (event) =>{
                event.preventDefault();

                let data = {};
                let OK = true;
                resultForm.removeErrors();
                resultForm.inputs.forEach((input) => {
                    let res = Validator.isValid(input.id, input.value)
                    if (res !== undefined && !res.res) {
                        resultForm.addError(input, res.error)
                        OK = false;
                    }
                })

                if (OK) {
                    resultForm.inputs.forEach((input) => {
                        data[input.id] = input.value;
                    })
                }

                // data['file'] = document.getElementById('file').files[0]
                let formData = new FormData()
                formData.append('image', document.getElementById('file').files[0])

                Request.updateAvatar(formData).then((response) => console.log(response.status))

                // TODO: AJAX

            })

        })
    }
}