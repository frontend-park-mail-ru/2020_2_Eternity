import Form from "../../components/form/form.js";
import Button from "../../components/button/button.js";
import Input from "../../components/input/input.js";

export default class FormGenerator {
    elements = []

    action
    method

    constructor(action, method = '') {
        this.action = action
        this.method = method
    }

    appendInput(type, classes = 'form__input', label = '', placeholder = '', value = '') {
        const inputContext = {
            type: type
        }

        if (classes.length > 0) {
            inputContext['customClasses'] = classes
        }

        if (placeholder.length > 0) {
            inputContext['placeholder'] = placeholder
        }

        if (label.length > 0) {
            inputContext['label'] = label
        }

        if (value.length > 0) {
            inputContext['value'] = value
        }

        this.elements.push(new Input(inputContext))
    }

    appendButton(type, text, classes = '') {
        const buttonContext = {
            type: type,
            btnText: text
        }

        if (classes.length > 0) {
            buttonContext['extraClasses'] = classes
        }

        this.elements.push(new Button(buttonContext))
    }

    appendElement(element) {
        this.elements.push(element)
    }

    renderAll() {
        let elements = []

        this.elements.forEach((elem) => {
            elements.push(elem.render())
        })

        const formContext = {
            action: this.action,
            elements: elements
        }

        if (this.method.length > 0) {
            formContext['method'] = this.method
        }

        const form = new Form(formContext)

        return form.render()
    }
}