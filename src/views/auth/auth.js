import template from "./auth.hbs"

import Base from "../base.js";

import FormGenerator from "../../modules/tools/form_generator.js";
import Validator from "../../modules/tools/validator.js";

import eventBus from "../../modules/tools/eventBus.js";
import {Events} from "../../modules/consts/events.js";
import Input from "../../components/input/input";
import Button from "../../components/button/button";

export default class AuthRegPage extends Base {
    #form;
    #pageType;

    constructor(pageType, context = {}) {
        super('Авторизация', context, null);
        this.template = template;

        this.#pageType = pageType;
    }

    render() {
        let elements = [];

        if (this.#pageType === 'registration') {
            elements.push(new Input({
                label: 'Адрес электронной почты',
                type: 'email',
                customClasses: 'form__input',
                placeholder: 'example@email.com',
                id: 'email'
            }));
        }

        elements.push(new Input({
            label: 'Логин',
            type: 'text',
            customClasses: 'form__input',
            placeholder: 'Username',
            id: 'username'
        }));

        elements.push(new Input({
            label: 'Пароль',
            type: 'password',
            customClasses: 'form__input',
            placeholder: 'Password',
            id: 'password'
        }));

        if (this.#pageType === 'registration') {
            elements.push(new Button({
                id: 'submit',
                type: 'submit',
                btnText: 'Зарегистрироваться'
            }));
        } else {
            elements.push(new Button({
                id: 'submit',
                type: 'submit',
                btnText: 'Войти'
            }));
        }

        this.#form = new FormGenerator(this.#pageType, ...elements).createForm();

        const data = {
            form: this.#form.render()
        };

        this.fillWith(data);
        super.render();

        this.#form.bind('submit', (event) => {
            event.preventDefault();

            let data = {};
            // TODO: по хорошему тут нужно делать разные формы..
            if (this.#pageType === 'auth') {
                data.username = document.getElementById('username').value;
                data.password = document.getElementById('password').value;
                eventBus.emit(Events.userLogin, data);
            } else {
                data.email = document.getElementById('email').value;
                data.password = document.getElementById('password').value;
                data.username = data.email.split('@')[0];
                eventBus.emit(Events.userSignup, data);
            }

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