import template from "./Auth.hbs"

import BaseView from "../BaseView.js";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import FormGenerator from "../../modules/tools/FormGenerator.js";
import Validator from "../../modules/tools/Validator.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Avatar from "../../components/Avatar/Avatar";


/**
 * @class View, отвечающая за авторизацию
 */
export default class AuthRegPage extends BaseView {
    form
    pageType
    username
    password

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
    }

    /**
     * Генерирует набор html-тегов, заполненных контекстом
     *
     * @return //TODO: понять и простить
     */
    render() {
        this.pageType === 'registration' ? (this.context.reg = true) : (this.context.reg = false);

        const email = new Input({
            label: 'Адрес электронной почты',
            type: 'text',
            placeholder: 'example@email.com',
            id: 'email'
        }, Validator.validateEmailField);
        this.username = new Input({
            label: 'Логин',
            type: 'text',
            placeholder: 'Username',
            id: 'username'
        }, Validator.validateAlphaField)
        this.password = new Input({
            label: 'Пароль',
            type: 'password',
            placeholder: 'Password',
            id: 'password'
        }, Validator.validatePasswordField);
        const btn = new Button({
            id: 'submit',
            type: 'submit',
            text: this.pageType === 'registration'? 'Зарегистрироваться' : 'Войти',
            customButton: 'btn_green',
        });

        let elements = [this.username, this.password, btn];
        if (this.pageType === 'registration') {
            elements.unshift(email);
        }
        this.form = new FormGenerator(this.pageType, ...elements).createForm();

        // LEFT PIC
        if (localStorage.getItem('authImg') && localStorage.getItem('authImgLink') && localStorage.getItem('authImgAuthor')) {
            this.context.linkImg = localStorage.getItem('authImg');
            this.context.link = localStorage.getItem('authImgLink');
            this.context.username = localStorage.getItem('authImgAuthor');
            this.context.avatar = localStorage.getItem('authImgAuthorAvatar') || '/img/default.svg'
        } else {
            this.context.linkImg = "/img/authCat.jpg";
        }

        const data = {
            form: this.form.render(),

            username: this.context.username,
            avatar: new Avatar({
                img_link: this.context.avatar,
                custom: 'avatar_mini'
            }).render()
        };

        this.fillWith(data);
        super.render();

        this.form.bind('submit', (event) => {
            event.preventDefault();

            let ok = true;
            let data = {};

            this.form.elements.forEach((element) => {
                if (element instanceof Input) {
                    element.checkValid();
                    if (element.hasError()) {
                        ok = false;
                    }
                }
            });

            if (ok) {
                data = {
                    username: this.form.getElement('username').value,
                    password: this.form.getElement('password').value
                };
                if (this.pageType === 'registration') {
                    data.email = this.form.getElement('email').value;
                }

                this.pageType === 'registration' ? eventBus.emit(Events.userSignup, data) : eventBus.emit(Events.userLogin, data);
            }
        })
    }
}

// TODO: Разбить на две отдельные формы;
//       Не делать генерацию каждый раз при вызове render();
//       Привязывать события вне view;
//       Получать сами значения через js, а не через element.value;
//       Значения должны также храниться сразу в js?;