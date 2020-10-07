import Base from "../base.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Validator from "../../modules/tools/validator.js";
import Request from "../../modules/request/request.js";

import {router} from "../../index.js"

export default class AuthRegPage extends Base {
    #pageType

    constructor(pageType, context = {}) {
        super('Авторизация', context, null);
        this.template = Handlebars.templates['auth.hbs'];

        this.#pageType = pageType
    }

    render() {
        Request.profile().then((response) => {
            if (response.ok) {
                router.open('/')
            }
        })

        const actions = {
            auth: '',
            registration: ''
        }

        const placeholders = {
            email: 'Адрес электронной почты',
            password: 'Пароль'
        }

        const form = new FormGenerator(actions[this.#pageType], '', this.#pageType)

        form.appendInput('email', 'form__input', placeholders['email'], '', '', 'email')
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
            data['email'] = document.getElementById('email').value;
            data['password'] = document.getElementById('password').value;
            data['username'] = data['email'].split('@')[0]

            if (this.#pageType === 'registration') {
                Request.signup(data['username'], data['email'], data['password'])
                    .then((response) => {
                        console.log(response.status)
                        if (response.ok) {
                            console.log(response.ok)
                            Request.login(data['username'], data['password'])
                                .then((response) => {
                                    console.log(response.status)
                                    if (response.ok) {
                                        console.log(response.ok)
                                        router.open('/')
                                    }
                                })
                        } else {
                            alert('Данные уже существуют')
                        }
                    })
            } else if (this.#pageType === 'auth') {
                Request.login(data['username'], data['password']).then((response) => {
                    console.log(response.status)
                    if (response.ok) {
                        console.log(response.ok)
                        router.open('/')
                    } else {
                        alert('Некорректные данные')
                    }
                })
            }
        })
    }
}