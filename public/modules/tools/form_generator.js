import Form from "../../components/form/form.js";
import Button from "../../components/button/button.js";
import Input from "../../components/input/input.js";

export default class FormGenerator {
    elements = []
    inputs = []

    action
    method
    id

    constructor(action, method = '', id= '') {
        this.action = action
        this.method = method
        this.id = id
    }

    appendInput(type, classes = 'form__input', label = '', placeholder = '', value = '', id = '') {
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

        if (id.length > 0) {
            inputContext['id'] = id
            this.inputs.push(id)
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

    fill() {
        let elements = []

        this.elements.forEach((elem) => {
            elements.push(elem.render())
        })

        const formContext = {
            action: this.action,
            elements: elements,
            enctype: 'multipart/form-data',
            inputs: this.inputs
        }

        if (this.method.length > 0) {
            formContext['method'] = this.method
        }
        if (this.id.length > 0) {
            formContext['id'] = this.id
        }

        return new Form(formContext)
    }

    renderAll() {
        return this.fill().render()
    }
}