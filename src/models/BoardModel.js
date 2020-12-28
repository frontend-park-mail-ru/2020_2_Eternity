import request from "../modules/request/Request.js";
import {fakeBoard} from "../modules/consts/fake.js";

class BoardModel {
    constructor() {}

    getBoard(data={}) {
        return request.board(data.board).then((response) => {
            return response.json();
        });
    }

    getBoardCover(data={}) {
        return request.getBoardCover(data.board_id).then((response) => {
            return response.json();
        })
    }

    createBoard(data={}) {
        return request.boardPost(data.title, data.description).then((response) => {
            return response.json();
        });
    }

    getUserBoards(data={}) {
        return request.getUserBoards(data.username).then((response) => {
            return response.json();
        });
    }

    attachPin(data = {}) {
        return request.attachPin(data.board_id, data.pin_id).then((response) => {
            return response;
        });
    }

    detachPin(data={}) {
        return request.detachPin(data.board_id, data.pin_id).then((r) => {
            return r;
        })
    }

    checkAttachingPin(data={}) {
        return request.checkAttachingPin(data.pin_id).then((r) => {
            return r.json();
        })
    }


}

export default new BoardModel();