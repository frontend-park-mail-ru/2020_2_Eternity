import BaseController from "./BaseController.js";
import SearchView from "../views/search/search-view.js";

export default class ChatController extends BaseController {
    constructor() {
        super(new SearchView());
    }
}