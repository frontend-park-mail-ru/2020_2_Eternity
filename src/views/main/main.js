import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/Card-NEEDRENAME/Card.js";
import Cardd from "../../components/card/cardd.js";
import Popup from "../../components/Popup/Popup.js";
import {fakePins} from "../../modules/consts/fake.js";
import FileUpload from "../../components/FileUpload/FileUpload.js";
import Input from "../../components/Input-NEEDRENAME/Input.js";
import Validator from "../../modules/tools/Validator";
import Dropdown from "../../components/Dropdown/Dropdown";
import Textarea from "../../components/Textarea-NEEDRENAME/Textarea.js";
import Toggle from "../../components/Toggle-NEEDRENAME/Toggle";
import LabeledToggle from "../../components/Toggle-NEEDRENAME/LabeledToggle/LabeledToggle";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import Button from "../../components/Button-NEEDRENAME/Button";
import {Icons} from "../../modules/consts/icons";
import Checkbox from "../../components/Checkbox/Checkbox";


export default class MainPage extends BaseView {
    popupPinView
    card

    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;

        this.popupPinView = new Popup({
            id: 'pinView',
            content: 'hello, its me',
        });
        this.card = new Card();
        this.test = new Checkbox({
            id: 'chec',
            text: 'fsdsfsdfsd'
        })
    }


    render() {
        let list = [];

        this.context.pins = fakePins;

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                this.card.context = pin;
                list.push(this.card.render());
            });
        }

        const data = {
            pins: list,
            popup: this.popupPinView.render(),

            test: this.test.render()
        }

        this.fillWith(data);
        super.render()
    }
}
