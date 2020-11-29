import BaseController from "./BaseController.js";
import ChatPage from "../views/Chat/Chat.js";

export default class ChatController extends BaseController {
    constructor() {
        super(new ChatPage());
    }
}