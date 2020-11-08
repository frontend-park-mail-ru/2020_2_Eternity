import request from "../modules/request/Request.js";
import {fakeBoard} from "../modules/consts/fake.js";

class BoardModel {
    constructor() {}

    getBoard(data={}) {
        return fakeBoard
    }

    createBoard(data={}) {
    //    TODO: create board request
        return {};
    }
}

export default new BoardModel();