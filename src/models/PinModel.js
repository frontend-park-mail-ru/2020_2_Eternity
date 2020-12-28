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
        return request.getUserPins(data.username).then((response) => {
            return response.json();
        })
    }

    getAllPins() {
        return request.getAllPins().then((response) => {
            return response.json();
        })
    }

    getFeedPins() {
        return request.getSubPins().then((response) => {
            return response.json();
        })
    }

    getBoardPins(data = {}) {
        return request.getBoardPins(data.board).then((response) => {
            return response.json();
        });
    }

    getNextFeedPins(data = {}) {
        return request.getAllPins(data.lastPin).then((response) => {
            return response.json();
        })
    }

    getAllSearchData(data = {}) {
        return request.getSearchData(data.type, data.content).then((response) => {
            return response.json();
        })
    }

    getNextSearchData(data = {}) {
        return request.getSearchData(data.type, data.content, data.lastPin).then((response) => {
            return response.json();
        })
    }
}



export default new PinModel();