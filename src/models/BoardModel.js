import request from "../modules/request/Request.js";

class BoardModel {
    constructor() {}

    getBoard(data={}) {
        return request.board(data.board).then((response) => {
            return response.json();
        });
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
}

export default new BoardModel();