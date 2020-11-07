import request from "../modules/request/Request.js";
import {fakePin} from "../modules/consts/fake.js";

class PinModel {
    constructor() {}

    getPin(data={}) {
        fakePin.imgSrc = fakePin.imgSrc.replace(/\d+/, data['pin']);
        return {...fakePin}
    }

    createPin(data={}) {
        return request.pinPost(data).then((response) => {
            return response.json();
        })
    }

    getUserPins(data={}) {
        return request.getPin().then((response) => {
            return response.json();
        })
    }
}

export default new PinModel();