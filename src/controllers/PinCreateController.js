import BaseController from "./BaseController.js";
import PinCreate from "../views/PinCreate/PinCreate.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";


export default class PinCreateController extends BaseController {
    constructor() {
        super(new PinCreate());

        this.view.onResetPreview = this.onResetPreview.bind(this);
        this.view.onDragover = this.onDragover.bind(this);
        this.view.onDragleave = this.onDragleave.bind(this);
        this.view.onShowPreview = this.onShowPreview.bind(this);
    }

    on() {
        eventBus.on(Events.pinCreating, this.onPinCreating.bind(this));
        super.on();
    }

    off() {
        eventBus.off(Events.pinCreating, this.onPinCreating.bind(this));

        this.view.upload.reset.element.removeEventListener('click', this.view.onResetPreview);
        this.view.upload.element.removeEventListener('dragover', this.view.onDragover);
        this.view.upload.element.removeEventListener('dragleave', this.view.onDragleave);
        this.view.upload.element.removeEventListener('change', this.view.onShowPreview);

        super.off();
    }

    onPinCreating(data = {}) {
        data.event.preventDefault();

        let formData = new FormData;
        formData.append('img', data.file);
        formData.append('data', JSON.stringify({
            title: data.title,
            content: data.description
        }));

        PinModel.createPin(formData).then((response) => {
            if (!response.error) {
                console.log('new Pin!')
                eventBus.emit(Events.pathChanged, routes.profilePage);
            }
        }).catch((error) => console.log(error))
    }

    onResetPreview() {
        this.view.upload.resetPreviewBind();
    }
    onDragover(event) {
        this.view.upload.dragoverBind(event);
    }
    onDragleave(event) {
        this.view.upload.dragleaveBind(event);
    }
    onShowPreview(event) {
        this.view.upload.showPreviewBind(event);
    }
}