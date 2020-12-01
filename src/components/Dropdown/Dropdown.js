import template from "./Dropdown.hbs"

import BaseComponent from "../BaseComponent.js";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";

export default class Dropdown extends BaseComponent {
    constructor(context = {}) {
        super(template, context);

        const defaultConfig = {
            linkAttributeName: 'data-activates',
        }
        this.settings = Object.assign(defaultConfig, context);
        if (this.settings.linkAttributeName) {
            this.init();
        }
    }

    init() {
        this.isOpened = false;
        this.origin = null;
        this.dropdown = null;
        this.startListeners();
    }

    startListeners() {
        document.addEventListener('click', function (event) {
            this.origin = event.target.closest('[' + this.settings.linkAttributeName + ']');
            if (this.origin) {
                event.preventDefault();
                const targetSelector = this.origin.getAttribute(this.settings.linkAttributeName);
                this.dropdown = document.getElementById(targetSelector);
                this.hide();
                // this.show();
                this.getPositionByOrigin()
                this.dropdown.classList.add('dropdown__active');
                this.isOpened = true;
            }
        }.bind(this));

        this.closeOnClickOutsideBind();
        this.selectItemOnClickBind();
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

    closeOnClickOutsideBind() {
        document.addEventListener('click', (event) => {
            if ((this.isOpened && (event.target instanceof HTMLElement && !event.target.closest('.dropdown')) || !event.target instanceof HTMLElement)) {
                // this.dropdown.scrollTo(0,0)
                // this.flushSelectedItems();
                // this.dropdown.classList.remove('dropdown__active');
                // this.isOpened = false;
            }
        })
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

    show() {
        this.getPositionByOrigin()
        if (this.dropdown) {
            this.dropdown.classList.add('dropdown__active');
            this.isOpened = true;
        }
    }
    hide() {
        if (this.dropdown) {
            this.dropdown.scrollTo(0,0)
            this.flushSelectedItems();
            this.dropdown.classList.remove('dropdown__active');
            this.isOpened = false;
        }
    }

    selectItem(item) {
        if (item instanceof HTMLElement) {
            item.classList.add('dropdown__item__selected');
            item.querySelector('input').checked = true;
        }
    }
    unselectItem(item) {
        item.classList.remove('dropdown__item__selected');
        item.querySelector('input').checked = false;
    }

    bindCallbackOnItemClick(callback) {
        document.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.closest('.dropdown__item')) {
                 const clickedItem = event.target.closest('.dropdown__item');
                callback(clickedItem);
            }
        })
    }

    flushSelectedItems() {
        const selected = this.dropdown.querySelectorAll('li.dropdown__item');
        const options = Array.from(selected).map((element) => element);

        options.forEach((option) => {
            this.unselectItem(option);
        })
    }
    getSelectedItems() {
        const options = this.dropdown.querySelectorAll('input');
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
     * Устанавливает выделение итемов списка (css + input.checked = true) по массиву значений
     * (эти значения содержат в себе input)
     * @param itemsForSelect - [:id(num)]
     */
    setSelectedItems(itemsForSelect) {
        let options = this.dropdown.querySelectorAll('li.dropdown__item');
        options = Array.from(options).map((element) => element);

        options.forEach((option) => {
            const optionValue = option.querySelector('input').value;
            if (itemsForSelect.contains(optionValue)) {
                this.selectItem(option);
            }
        })
    }

}