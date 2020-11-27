import template from "./auth.hbs"

import BaseView from "../BaseView.js";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import Validator from "../../modules/tools/Validator.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Input from "../../components/input/input";
import Button from "../../components/Button-NEEDRENAME/Button";


/**
 * @class View, отвечающая за авторизацию
 */
export default class AuthRegPage extends BaseView {
    #form;
    #pageType;

    /**
     * Конструирует новую страницу для авторизации или регистрации
     *
     * @constructor
     * @param {('registration'|'auth')} pageType Тип конструируемой страницы
     * @param {Object} [context] Контекст, содержащий элементы страницы
     */
    constructor(pageType, context = {}) {
        super('Авторизация', context, null);
        this.template = template;

        this.#pageType = pageType;
    }

    /**
     * Генерирует набор html-тегов, заполненных контекстом
     *
     * @return //TODO: понять и простить
     */
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
                text: 'Зарегистрироваться'
            }));
        } else {
            elements.push(new Button({
                id: 'submit',
                type: 'submit',
                text: 'Войти'
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

            this.#form.elements.forEach((element) => {
                if (element instanceof Input && element.error) {
                    element.resetError();
                }
            });

            let data = {
                username: this.#form.getElement('username').element.value,
                password: this.#form.getElement('password').element.value
            };

            Validator.validateUsernameField(data.username).forEach((error) => {
                this.#form.getElement('username').addError(error);
            });

            Validator.validatePasswordField(data.password).forEach((error) => {
                this.#form.getElement('password').addError(error);
            });

            if (this.#pageType === 'registration') {
                data.email = this.#form.getElement('email').element.value;
                Validator.validateEmailField(data.email).forEach((error) => {
                    this.#form.getElement('email').addError(error);
                });
            }

            if (![...this.#form.elements.values()].some((element) => {
                if (element instanceof Input) {
                    return element.error;
                }
            })) {
                if (this.#pageType === 'registration') {
                    eventBus.emit(Events.userSignup, data);
                } else {
                    eventBus.emit(Events.userLogin, data);
                }
            }
        })
    }
}

// TODO: Разбить на две отдельные формы;
//       Не делать генерацию каждый раз при вызове render();
//       Привязывать события вне view;
//       Получать сами значения через js, а не через element.value;
//       Значения должны также храниться сразу в js?;



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