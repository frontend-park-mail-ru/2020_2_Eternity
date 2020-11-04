import Form from "../../components/form/form.js";

export default class FormGenerator {
    elements;
    id;

    /**
     * Конструирует новую форму с заданным id
     *
     * @param {string} [id]
     */
    constructor(id= '') {
        this.id = id;
        this.elements = new Map();
    }

    /**
     * Добавляет новый готовый элемент в форму
     *
     * @param {Object} element
     * @param {string} id
     */
    appendElement(element, id) {
        this.elements.set(id, element);
    }

    /**
     * Генерирует готовую форму
     *
     * @return {Form}
     */
    createForm() {
        const formContext = {
            elements: this.elements,
            enctype: 'multipart/form-data' // TODO: delete
        };

        return new Form(formContext);
    }
}