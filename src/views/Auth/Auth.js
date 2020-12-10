import template from "./Auth.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import Validator from "../../modules/tools/Validator.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";


/**
 * @class View, отвечающая за авторизацию
 */
export default class AuthRegPage extends BaseView {
    form;
    pageType;

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
        this.pageType = pageType;
        this.pageType === 'registration' ? (this.context.reg = true) : (this.context.reg = false);
    }

    /**
     * Генерирует набор html-тегов, заполненных контекстом
     *
     * @return //TODO: понять и простить
     */
    render() {
        const email = new Input({
            label: 'Адрес электронной почты',
            type: 'email',
            placeholder: 'example@email.com',
            id: 'email'
        });
        const username = new Input({
            label: 'Логин',
            type: 'text',
            placeholder: 'Username',
            id: 'username'
        })
        const password = new Input({
            label: 'Пароль',
            type: 'password',
            placeholder: 'Password',
            id: 'password'
        });
        const btn = new Button({
            id: 'submit',
            type: 'submit',
            text: this.pageType === 'registration'? 'Зарегистрироваться' : 'Войти'
        });

        let elements = [username, password, btn];
        if (this.pageType === 'registration') {
            elements.unshift(email);
        }
        this.form = new FormGenerator(this.pageType, ...elements).createForm();

        const data = {
            form: this.form.render()
        };

        this.fillWith(data);
        super.render();

        this.form.bind('submit', (event) => {
            event.preventDefault();

            this.form.elements.forEach((element) => {
                if (element instanceof Input && element.error) {
                    element.resetError();
                }
            });

            let data = {
                username: this.form.getElement('username').element.value,
                password: this.form.getElement('password').element.value
            };

            Validator.validateUsernameField(data.username).forEach((error) => {
                this.form.getElement('username').addError(error);
            });

            Validator.validatePasswordField(data.password).forEach((error) => {
                this.form.getElement('password').addError(error);
            });

            if (this.pageType === 'registration') {
                data.email = this.form.getElement('email').element.value;
                Validator.validateEmailField(data.email).forEach((error) => {
                    this.form.getElement('email').addError(error);
                });
            }

            if (![...this.form.elements.values()].some((element) => {
                if (element instanceof Input) {
                    return element.error;
                }
            })) {
                if (this.pageType === 'registration') {
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