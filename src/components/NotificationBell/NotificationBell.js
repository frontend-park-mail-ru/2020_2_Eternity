import template from "./NotificationBell.hbs"

import BaseComponent from "../BaseComponent.js";

/**
 * Класс, отвечающий за колокольчик (символ уведомлений в навбаре)
 */
export default class NotificationBell extends BaseComponent {
    countNews

    /**
     *
     * @param context - custom - классы кастомизации колокольчика,
     *                  num - количество уведомлений изначально (аналог setCount)
     *                  dataAttr - data-attribute (data-activates для дропдауна)
     *
     */
    constructor(context = {}) {
        super(template, context);
        this.countNews = 0;
    }

    /**
     * Если количество уведомлений >=100 (не влезает в кружок), то
     * ставит цвет текста в кружке прозрачным
     */
    isCountTooMuch() {
        if (this.element) {
            if (this.countNews >= 100) {
                this.element.querySelector('.notification__count').classList.add('notification__count_too-much');
            } else {
                this.element.querySelector('.notification__count').classList.remove('notification__count_too-much');
            }
        }
    }

    /**
     * Если количество уведомлений = 0 (новых нет), то прячет кружок
     * Иначе делает его видимым
     */
    isCountIsZero() {
        if (this.element) {
            if (this.countNews === 0) {
                this.element.querySelector('.notification__count').classList.add('hidden');
            } else {
                this.element.querySelector('.notification__count').classList.remove('hidden');
            }
        }
    }

    /**
     * +1 к количеству уведомлений в кружке
     */
    addNotification() {
        ++this.countNews;
        if (this.element) {
            this.isCountTooMuch();
            this.isCountIsZero();
            this.element.querySelector('.notification__count').innerHTML = this.countNews.toString();
        }
    }

    /**
     * -1 к количеству уведомлений в кружке
     */
    decNotification() {
        --this.countNews;
        if (this.element) {
            this.isCountTooMuch();
            this.isCountIsZero();
            this.element.querySelector('.notification__count').innerHTML = this.countNews.toString();
        }
    }

    /**
     * Задает количество новых уведомлений в кружке пачкой (например при входе пользователя)
     * @param {Object} data
     */
    setNotificationsCount(data) {
        this.countNews = data.num;
        this.context.num = data.num;
        if (this.element) {
            this.isCountTooMuch();
            this.isCountIsZero();
            this.element.querySelector('.notification__count').innerHTML = data.num;
        }
    }

    /**
     * Кол-во новых (непрочитанных) уведомлений = 0
     */
    clearNotificationsCount() {
        this.countNews = 0;
        this.context.num = 0;
        if (this.element) {
            this.isCountIsZero();
            this.element.querySelector('.notification__count').innerHTML = '';
        }
    }
}