import Form from "../../components/form/form.js";

/**
 * @class Класс генерирует новую форму
 */
export default class FormGenerator {
    elements;
    id;

    /**
     * Конструирует заготовку для формы с заданными id и элементами
     *
     * @constructor
     * @param {string} [id] Id формы
     * @param {...Object} elements Массив готовых элементов
     */
    constructor(id= '', ...elements) {
        this.id = id;
        this.elements = new Map();

        elements.forEach(element => {
            this.elements.set(element.context.id, element);
        });
    }

    /**
     * Добавляет новый готовый элемент в форму
     *
     * @param {Object} element Сгенерированный элемент
     * @param {string} id Id этого элемента
     */
    appendElement(element, id) {
        this.elements.set(id, element);
    }

    /**
     * Генерирует готовую форму
     *
     * @return {Form} Новая форма
     */
    createForm() {
        let renderedElements = [];

        this.elements.forEach((element) => {
            renderedElements.push(element.render());
        });

        const formContext = {
            id: this.id,
            elements: renderedElements,
            enctype: 'multipart/form-data' // TODO: delete
        };

        return new Form(formContext, this.elements);
    }
}