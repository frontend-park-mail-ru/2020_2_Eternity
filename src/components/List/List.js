import template from "./List.hbs"
import BaseComponent from "../BaseComponent.js";
import Item from "./Item/Item";

export default class List extends BaseComponent {
    settings
    elements    // (c <li> oт createItem)
    name        // id of list - область видимости для items

    /**
     *
     * @param context
     * @param settings - {selectable: ''|'radio'|'checkbox'}
     */
    constructor(context={}, settings={}) {
        super(template, context);
        this.elements = [];
        this.name = context.id;

        const defaultSettings = {
            selectable: '',
        }
        this.settings = settings || defaultSettings;
    }

    /**
     *
     * @param itemObject - JS-объект элемента (компонент <- BaseComponent)
     * @param {'prepend' | 'append'} order - вставить в начало(prepend)/конец(append), по ум. append
     */
    addItem(itemObject,  order='append') {
        const newItem = this.createItem(itemObject);
        order === 'append' ? this.elements.push(newItem) : this.elements.unshift(newItem);
        if (this.element) {
            order === 'append' ? this.element.append(newItem.render()) : this.element.prepend(newItem.render());
        }
    }
    removeItem() {
        // shift/pop (konec)
    }

    formContentFromListObjects(list) {
        this.clearContent();
        let res = '';
        list.forEach((elem) => {
            const item  = this.createItem(elem);
            this.elements.push(item);
            res += item.render();
        });
        if (this.element) {
            this.element.innerHTML = res;
        }
        return res;
    }

    render() {
        let res = ''
        this.elements.forEach((elem) => {
            res += elem.render();
        })
        this.context.content = res;
        return super.render();
    }

    clearContent() {
        this.elements = [];
        if (this.element) {
            this.element.innerHTML = '';
        }
    }

    createItem(itemObj) {
        return new Item({type: this.settings.selectable, for: this.name}, itemObj, itemObj.context.id);
    }

    getSelectedItems() {
        if (this.element) {
            const options = this.element.querySelectorAll('input');
            const values = Array.from(options).map((element) => element);

            let res = [];
            values.forEach((value) => {
                if (value.checked) {
                    res.push({id: value.value});
                }
            })
            return res;
        }
    }
    setSelectedItems(itemsForSelect) {
        const options = this.element.querySelectorAll('input');
        const values = Array.from(options).map((element) => element);

        values.forEach((value) => {
            if (itemsForSelect.contains(value.value)) {
                value.checked = true;
            }
        })
    }
    flushSelectedItems() {
        const options = this.element.querySelectorAll('input');
        const values = Array.from(options).map((element) => element);
        values.forEach((value) => {
            value.checked = false;
        })
    }
}