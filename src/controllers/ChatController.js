import BaseController from "./BaseController.js";
import ChatPage from "../views/chat/chat.js";

export default class ChatController extends BaseController {
    constructor() {
        super(new ChatPage());
    }
}