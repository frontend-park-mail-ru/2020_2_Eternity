import BaseController from "./BaseController.js";
import PinCreating from "../views/pin-creating/pin-creating.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";

export default class CreateController extends BaseController {
    // TODO: type page
    constructor() {
        super(new PinCreating());
    }

    on() {
        eventBus.on(Events.pinCreating, this.onPinCreating.bind(this));
        //eventBus.on(Events.boardCreating, this.onDeskCreating.bind(this));
        super.on();
    }

    onPinCreating(data = {}) {
        data.event.preventDefault();
        // TODO: да емае, загрузка файлов ни аватарки ни пина не работает, я наверное делаю неправильно

        let formData = new FormData;
        formData.append('img', data.file);
        formData.append('data', JSON.stringify({
            title: data.title,
            content: data.description
        }));

        PinModel.createPin(formData).then((response) => {
            if (!response.error) {
                console.log('new pin!')
                eventBus.emit(Events.pathChanged, routes.profilePage);
            }
        }).catch((error) => console.log(error))
    }
}