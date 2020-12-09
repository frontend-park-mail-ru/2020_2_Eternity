import template from "./Dropdown.hbs"

import BaseComponent from "../BaseComponent.js";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";

export default class Dropdown extends BaseComponent {
    isOpened
    origin
    dropdown

    constructor(context = {}) {
        super(template, context);

        const defaultConfig = {
            linkAttributeName: 'data-activates',
        }
        this.settings = Object.assign(defaultConfig, context);
        if (this.settings.linkAttributeName) {
            this.init();
        }

        this.closeOnClickOutside = this.closeOnClickOutsideBind.bind(this);
    }

    init() {
        this.isOpened = false;
        this.origin = null;
        this.dropdown = null;
    }

    startListeners() {
        document.addEventListener('click', this.closeOnClickOutside);
        // this.selectItemOnClickBind();
    }
    removeListeners() {
        document.removeEventListener('click', this.closeOnClickOutside);
    }

    closeOnClickOutsideBind(event) {
        if (this.isOpened && (!event.target.closest('.dropdown') || !(event.target instanceof HTMLElement))) {
            this.hide();
        }
    }
    selectItemOnClickBind() {
        document.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.closest('.dropdown__item')) {
                const item = event.target.closest('.dropdown__item');
                item.classList.toggle('dropdown__item__selected');
            }
            // TODO: emit eventBus добавление на доску, удаление
        })
    }



    getPositionByOrigin() {
        const position = this.origin.getBoundingClientRect()
        if (document.documentElement.clientWidth - position.x < 210) {
            position.x = position.x - 210 + this.origin.offsetWidth;
        }
        if (document.documentElement.clientHeight - position.y < 150) {
            position.y = position.y - 140 ;
        }
        this.dropdown.style.left = position.x + 'px';
        this.dropdown.style.top = position.y + window.scrollY + 'px';
    }

    show() {
        this.getPositionByOrigin()
        if (this.dropdown && !this.isOpened) {
            this.dropdown.classList.add('dropdown__active');
            this.isOpened = true;
        }
        this.startListeners();
    }
    hide() {
        if (this.dropdown && this.isOpened) {
            this.dropdown.scrollTo(0,0)
            this.flushSelectedItems();
            this.dropdown.classList.remove('dropdown__active');
            this.isOpened = false;
        }
        this.removeListeners();
    }



    selectItem(item) {
        if (item instanceof HTMLElement) {
            item.classList.add('dropdown__item__selected');
            item.querySelector('Input').checked = true;
        }
    }
    unselectItem(item) {
        item.classList.remove('dropdown__item__selected');
        item.querySelector('Input').checked = false;
    }

    flushSelectedItems() {
        const selected = this.dropdown.querySelectorAll('li.dropdown__item');
        const options = Array.from(selected).map((element) => element);

        options.forEach((option) => {
            this.unselectItem(option);
        })
    }
    getSelectedItems() {
        const options = this.dropdown.querySelectorAll('Input');
        const values = Array.from(options).map((element) => element);

        let result = [];
        values.forEach((value) => {
            if (value.checked) {
                result.push({id: value.value});
            }
        });
        return result;
    }

    /**
     * Устанавливает выделение итемов списка (css + Input.checked = true) по массиву значений
     * (эти значения содержат в себе Input)
     * @param itemsForSelect - [:id(num)]
     */
    setSelectedItems(itemsForSelect) {
        let options = this.dropdown.querySelectorAll('li.dropdown__item');
        options = Array.from(options).map((element) => element);

        options.forEach((option) => {
            const optionValue = option.querySelector('Input').value;
            if (itemsForSelect.contains(optionValue)) {
                this.selectItem(option);
            }
        })
    }


    onFillContent(data={}) {
        data.list.forEach((item) => {
            this.addToContent(item);
        })
    }

    addToContent(elem={}) {
        this.options.push(elem);
        if (this.dropdown) {
            this.dropdown.insertAdjacentElement('beforeend', this.createDropdownItem(elem));
        }
    }

    formDropdownContent(list) {
        let res = '';
        list.forEach((e) => {
            const item = this.createDropdownItem(e);
            res += item.outerHTML;
        })
        if (this.dropdown) {
            this.dropdown.innerHTML = res;
        }

    }
    createDropdownItem(data={}) {
        const elem = document.createElement('li');
        elem.classList.add('dropdown__item')

        const label = document.createElement('label');
        const span = document.createElement('span');
        span.innerHTML = data.title;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = data.id;

        label.insertAdjacentElement('beforeend', span);
        label.insertAdjacentElement('beforeend', input);

        return label;
    }
}