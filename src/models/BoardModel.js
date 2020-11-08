import request from "../modules/request/Request.js";
import {fakeBoard} from "../modules/consts/fake.js";

class BoardModel {
    constructor() {}

    getBoard(data={}) {
        return fakeBoard
    }

    createBoard(data={}) {
        return request.boardPost(data.title, data.description).then((response) => {
            return response.json();
        })
    }
}

export default new BoardModel();