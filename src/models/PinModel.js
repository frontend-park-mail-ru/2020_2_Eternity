import request from "../modules/request/Request.js";

class PinModel {
    constructor() {}

    getPin(data={}) {
        return request.getPin(data['pin']).then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
    }

    getPinComments(data={}) {
        return request.getPinComments(data['pin']).then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
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