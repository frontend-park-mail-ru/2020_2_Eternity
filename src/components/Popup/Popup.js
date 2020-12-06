import template from "./Popup.hbs"

import BaseComponent from "../BaseComponent.js";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";


export default class Popup extends BaseComponent {
    constructor(context={}) {
        super(template, context);

        const defaultConfig = {
            withShadow: true,

            closeOnCloseBtn: true,
            closeOnOverlay: true,
            closeOnEsc: true,

            catchFocus: true,

            linkAttributeName: 'data-popup',
            fixedSelector: '*[data-fixed]',
        }

        this.settings = Object.assign(defaultConfig, context);
        if (this.settings.linkAttributeName){
            this.init();
        }
    }

    static shadow = false;

    init() {
        this.isOpened = false;
        this.openedWindow = null;
        this.scrollPosition = 0;
        this.checkOverlay = false;

        this.origin = null;

        this._focusElements = [
            'a[href]',
            'area[href]',
            'Input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'Button:not([disabled]):not([aria-hidden])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];

        if(!Popup._shadow && this.settings.withShadow){
            Popup._shadow = document.createElement('div');
            Popup._shadow.classList.add('modal-window__shadow');
            document.body.appendChild(Popup._shadow);
        }
    }


    /**
     * Привязывает обработчики к событиям:
     * click:
     *      - btn close - закрытие модального окна по нажатию Х в окне
     * согласно Settings:
     *      - closeOnOverlay - если true: закрывать окно по клику вне окна
     *      - closeOnEsc - если true: закрывать окно по Esc
     *      - catchFocus - если true: переключать фокус на элементы внутри окна по Tab
     */
    startListeners() {
        document.addEventListener('click', this.closeOnBtnBind.bind(this));
        if (this.settings.closeOnOverlay) {
            document.addEventListener('mousedown', this.closeOnOverlayMousedownBind.bind(this));
            document.addEventListener('mouseup', this.closeOnOverlayMouseupBind.bind(this));
        }
        if (this.settings.closeOnEsc) {
            window.addEventListener('keydown', this.closeOnEscBind.bind(this));
        }
        if (this.settings.catchFocus) {
            window.addEventListener('keydown', this.focusCatchOnTabBind.bind(this));
        }
    }

    /**
     * Удаляет обработчики при закрытии окна
     */
    removeListeners() {
        document.removeEventListener('click', this.closeOnBtnBind.bind(this));
        if (this.settings.closeOnOverlay) {
            document.removeEventListener('mousedown', this.closeOnOverlayMousedownBind.bind(this));
            document.removeEventListener('mouseup', this.closeOnOverlayMouseupBind.bind(this));
        }
        if (this.settings.closeOnEsc) {
            window.removeEventListener('keydown', this.closeOnEscBind.bind(this));
        }
        if (this.settings.catchFocus) {
            window.removeEventListener('keydown', this.focusCatchOnTabBind.bind(this));
        }
    }

    /**
     * Event Listener для закрытия окна по крестику
     * @param event
     */
    closeOnBtnBind(event) {
        if (this.settings.closeOnCloseBtn && event.target.closest('[data-close]')) {
            this.close();
        }
    }

    /**
     * Event Listeners для mouseclick
     * Проверяет клик (нажать/отпустить клавишу) по оверлею (wrap)
     * Нужно, чтобы закрытие не срабатывало, когда нажали, например, на оверлей, а отпустили в модальном окне
     */
    closeOnOverlayMouseupBind(event) {
        if (this.checkOverlay && event.target instanceof HTMLElement && event.target.classList.contains('modal-window__wrap')) {
            this.close();
        }
        this.checkOverlay = false;
    }
    closeOnOverlayMousedownBind(event) {
        if (event.target instanceof HTMLElement && event.target.classList.contains('modal-window__wrap')) {
            this.checkOverlay = true;
        }
    }

    /**
     * Event Listener для Esc на закрытие окна
     */
    closeOnEscBind(event) {
        if (event.code === 'Escape' && this.isOpened) {
            event.preventDefault();
            this.close();
        }
    }

    /**
     * Event Listener для Tab
     * Позволяет фокуситься на элементы модального окна по Tab
     * Проверяет, если фокус-элемент вне окна, а окно открыто, то перекидывает на 1й
     * элемент в окне для фокуса
     */
    focusCatchOnTabBind(event) {
        if (this.isOpened) {
            const nodesArray = this.openedWindow.querySelectorAll(this._focusElements);

            if (event.code === 'Tab') {
                if (!this.openedWindow.contains(document.activeElement)) {
                    nodesArray[0].focus();
                }
            }
        }
    }

    /**
     * Открывает окно на странице по селектору
     * Устанавливает значения атрибутов в состояние Виден, фиксит скролл
     *
     * @param {string} selector
     */
    open(selector = '') {
        if (selector) {
            if (typeof selector === 'string') {
                this.openedWindow = document.querySelector(selector);
            } else {
                return;
            }
        }
        if (!this.openedWindow) {
            console.log("Warning: Modal window is not found");
            return;
        }

        this.fixBodyScroll();

        if (Popup._shadow && this.settings.withShadow) {
            Popup._shadow.classList.add('modal-window__shadow_show');
        }
        this.openedWindow.classList.add('modal-window_active');
        this.openedWindow.setAttribute('aria-hidden', 'false');
        this.isOpened = true;
        this.startListeners();
    }


    /**
     * Скрывает модальное окно
     * Устанавливает атрибуты в состояние Скрыто, возвращает скролл до открытия окна
     */
    close() {
        if (!this.isOpened) {
            return;
        }
        this.openedWindow.classList.remove("modal-window_active");
        this.openedWindow.setAttribute('aria-hidden', 'true');
        this.openedWindow.scrollTop = 0;
        if (this.settings.withShadow && Popup._shadow) {
            Popup._shadow.classList.remove("modal-window__shadow_show");
        }

        this.returnBodyScroll();
        this.isOpened = false;
        this.removeListeners();
    }

    /**
     * Фиксирует положение прокрутки страницы при открытии/закрытии окна
     * При открытии окна вычисляет текущее смещение и устанавливает странице под окном
     */
    fixBodyScroll() {
        const html = document.documentElement;
        this.scrollPosition = window.pageYOffset;

        if (this.scrollPosition !== 0) {
            html.style.top = -this.scrollPosition + 'px';
        }
        html.classList.add("modal-window_opened");
    }

    /**
     * При закрытии окна возвращает скролл страницы к прежнему состоянию
     */
    returnBodyScroll() {
        const html = document.documentElement;

        if (this.isOpened) {
            html.classList.remove('modal-window_opened');
            if (this.scrollPosition !== 0) {
                window.scrollTo(0, this.scrollPosition);
            }
            html.style.top = '';
        }
    }

    clearContent() {
        this.context.content = '';
        if (this.isOpened) {
            this.openedWindow.querySelector('.modal-window__window__content').innerHTML = '';
        }
    }

    formContent(content) {
        this.context.content = content;
        if (this.isOpened) {
            this.openedWindow.querySelector('.modal-window__window__content').innerHTML = content;
        }
    }
}