import Base from "../base.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Validator from "../../modules/tools/validator.js";

import eventBus from "../../modules/tools/eventBus.js";
import {Events} from "../../modules/consts/events.js";

export default class AuthRegPage extends Base {
    #pageType

    constructor(pageType, context = {}) {
        super('Авторизация', context, null);
        this.template = Handlebars.templates['auth.hbs'];

        this.#pageType = pageType
    }

    render() {
        const actions = {
            auth: '',
            registration: ''
        }

        const placeholders = {
            email: 'Адрес электронной почты',
            password: 'Пароль'
        }

        const form = new FormGenerator(actions[this.#pageType], '', this.#pageType)

        if (this.#pageType === 'registration') {
            form.appendInput('email', 'form__input', placeholders['email'], '', '', 'email')
        } else {
            form.appendInput('text', 'form__input', 'Имя пользователя', 'Username', '', 'username')
        }

        form.appendInput('password', 'form__input', placeholders['password'], '', '', 'password')

        form.appendButton('submit', 'Войти')

        const data = {
            form: form.renderAll(),
        }

        this.fillWith(data);
        super.render()

        let resultForm = form.fill();

        resultForm.bind('submit', (event) => {
            event.preventDefault();

            let data = {};
            // TODO: по хорошему тут нужно делать разные формы, я пока попробую только для входа..
            if (this.#pageType === 'auth') {
                data.username = document.getElementById('username').value;
                data.password = document.getElementById('password').value;
            }
           eventBus.emit(Events.userLogin, data);
        })
    }
}


//let data = {};
//             if (this.#pageType === 'registration') {
//                 data['email'] = document.getElementById('email').value;
//                 data['username'] = data['email'].split('@')[0]
//             } else {
//                 data['realname'] = document.getElementById('username').value;
//             }
//             data['password'] = document.getElementById('password').value;
//
//             if (this.#pageType === 'registration') {
//                 Request.signup(data['username'], data['email'], data['password'])
//                     .then((response) => {
//                         console.log(response.status)
//                         if (response.ok) {
//                             console.log(response.ok)
//                             Request.login(data['username'], data['password'])
//                                 .then((response) => {
//                                     console.log(response.status)
//                                     if (response.ok) {
//                                         console.log(response.ok)
//                                         router.open('/')
//                                     }
//                                 })
//                         } else {
//                             alert('Данные уже существуют')
//                         }
//                     })
//             } else if (this.#pageType === 'auth') {
//                 Request.login(data['realname'], data['password']).then((response) => {
//                     console.log(response.status)
//                     if (response.ok) {
//                         console.log(response.ok)
//                         router.open('/')
//                     } else {
//                         alert('Некорректные данные')
//                     }
//                 })
//             }