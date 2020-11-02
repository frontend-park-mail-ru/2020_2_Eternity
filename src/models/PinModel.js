import request from "../modules/request/request.js";

class PinModel {
    constructor() {}

    getPin(data={}) {

    }

    createPin(data={}) {
        return request.pinPost(data).then((response) => {
            return response.json();
        })
    }
}

export default new PinModel();