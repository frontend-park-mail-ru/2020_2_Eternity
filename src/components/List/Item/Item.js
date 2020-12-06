import template from "./Item.hbs"
import BaseComponent from "../../BaseComponent";

export default class Item extends BaseComponent {
    object
    id

    constructor(context = {}, obj, id) {
        super(template, context);
        this.object = obj;
        this.id = id;
        this.context.obj = this.object.render();
        this.context.value = this.id;
    }
}