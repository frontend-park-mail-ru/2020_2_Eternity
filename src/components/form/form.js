import template from './form.hbs'

/**
 * @class Класс, представляющий форму`
 */
export default class Form {
    elements;
    context;
    template;

    /**
     * Конструирует новую форму с контекстом
     *
     * @constructor
     * @param {Object} [context] Содержимое формы
     * @param {Map} [elements]
     */
    constructor(context = {}, elements = new Map()) {
        this.elements = elements;
        this.context = context;
        this.template = template;
    }

    /**
     * Генерирует набор html-тегов, заполненных контекстом
     *
     * @return //TODO: понять и простить
     */
    render() {
        return this.template(this.context);
    }

    /**
     * Возвращает js-элемент, принадлежащий форме
     *
     * @return {Object} Элемент
     */
    getElement(id) {
        return this.context.elements.get(id)
    }

    /**
     * Коллбэк, обрабатывающий событий
     *
     * @callback handler
     * @param {Object} event
     */

    /**
     * Связывает событие с коллбэком
     *
     * @param {string} event Тип события
     * @param {handler} callback
     */
    bind(event, callback) {
        document.getElementById(this.context.id).addEventListener(event, callback);
    }
}