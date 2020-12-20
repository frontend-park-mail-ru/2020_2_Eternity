import {urls} from './api.js'


// TODO: разбить на логические блоки (PinRequest, UserRequest, Board и тд)
export default class Request {
    /**
     * --------------------------------------------------------------------
     * BASE
     * --------------------------------------------------------------------
     */
    static request(path, method, ext = {}) {
        return fetch(path, {
            method: method,
            credentials: 'include',
            ...ext
        })
    }
    static requestGET(path, ext = {}) {
        return Request.request(path, 'GET', ext);
    }
    static requestPOST(path, ext = {}) {
        return Request.request(path, 'POST', ext);
    }
    static requestPUT(path, ext = {}) {
        return Request.request(path, 'PUT', ext);
    }

    /**
     * --------------------------------------------------------------------
     * USER AUTH
     * --------------------------------------------------------------------
     */
    static login(username, password) {
        return this.requestPOST(urls.login, {
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });
    }

    static signup(username, email, password) {
        return this.requestPOST(urls.signup, {
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        });
    }

    static logout() {
        return this.requestPOST(urls.logout, {
            mode: 'no-cors',
        });
    }

    /**
     * --------------------------------------------------------------------
     * USER PROFILE
     * --------------------------------------------------------------------
     */
    static profile() {
        return this.requestGET(urls.profile);
    }

    static getUserProfile(username) {
        return this.requestGET(urls.userProfile.replace(':username', username));
    }

    static updatePassword(oldPassword, newPassword) {
        return this.requestPUT(urls.updatePassword, {
            body: JSON.stringify({
                oldpassword: oldPassword,
                newpassword: newPassword,
            })
        });
    }

    static updateProfile(username, email, name, surname, description) {
        return this.requestPUT(urls.updateProfile, {
            body: JSON.stringify({
                username: username,
                email: email,
                name: name,
                surname: surname,
                description: description
            })
        });
    }

    static updateAvatar(file) {
        return this.requestPOST(urls.avatar, {
            body: file
        });
    }

    static getAvatar(imgLink) {
        return this.requestGET(urls.avatar);
    }

    /**
     * --------------------------------------------------------------------
     * PINS
     * --------------------------------------------------------------------
     */
    static getPin(id) {
        return this.requestGET(urls.pin.replace(':id', id), {
            mode: 'cors',
        });
    }

    static pinPost(data) {
        return this.requestPOST(urls.pinPost, {
            body: data,
            /*body: JSON.stringify({
                title: title,
                content: content,
                imgLink: imgLink
            })*/
        });
    }

    static getAllPins(lastPin) {
        return this.requestGET(urls.feed.replace(':option', lastPin ? `?last=${lastPin}` : ''));
    }

    static getUserPins(username) {
        return this.requestGET(urls.pins.replace(':username', username));
    }

    static attachPin(boardId, pinId) {
        return this.requestPOST(urls.attachPin, {
            body: JSON.stringify({
                board_id: boardId,
                pin_id: pinId
            })
        });
    }

    static getBoardPins(id) {
        return this.requestGET(urls.boardPins.replace(':id', id));
    }

    /**
     * --------------------------------------------------------------------
     * BOARDS
     * --------------------------------------------------------------------
     */
    static boardPost(title, content) {
        return this.requestPOST(urls.boardPost, {
            body: JSON.stringify({
                title: title,
                content: content
            })
        });
    }

    static board(id) {
        return this.requestGET(urls.board.replace(':id', id));
    }

    static getUserBoards(username) {
        return this.requestGET(urls.boards.replace(':username', username));
    }

    /**
     * --------------------------------------------------------------------
     * COMMENTS
     * --------------------------------------------------------------------
     */
    static getPinComments(id) {
        return this.requestGET(urls.pinComments.replace(':id', id));
    }

    static commentPost(data={}) {
        return this.requestPOST(urls.pinCommentPost, {
            body: JSON.stringify({
                ...data
            })
        });
    }

    /**
     * --------------------------------------------------------------------
     * USER ACTIONS
     * --------------------------------------------------------------------
     */
    static followUser(username) {
        return this.requestPOST(urls.follow, {
            body: JSON.stringify({
                username: username,
            })
        });
    }

    static unfollowUser(username) {
        return this.requestPOST(urls.unfollow, {
            body: JSON.stringify({
                username: username,
            })
        });
    }

    static isFollowing(username) {
        return this.requestGET(urls.isFollowing.replace(':username', username));
    }

    /**
     * --------------------------------------------------------------------
     * SEARCH
     * --------------------------------------------------------------------
     */
    static getSearchData(type, content, lastPin = '') {
        return this.requestGET(urls.search
            .replace(':last', lastPin ? `&?last=${lastPin}` : '')
            .replace(':type', type)
            .replace(':content', content));
    }

    static getNotifications() {
        return this.requestGET(urls.notifications);
    }

    static getFollowers(username) {
        return this.requestGET(urls.followers.replace(':username', username));
    }
    static getFollowings(username) {
        return this.requestGET(urls.followings.replace(':username', username));
    }

    /**
     * --------------------------------------------------------------------
     * CHAT/DIALOGS
     * messages behavior in modules/websocket
     * --------------------------------------------------------------------
     */
    static createWSConnect() {
        return this.requestGET(urls.ws, {});
    }
    static createChat(collocutor) {
        return this.requestPOST(urls.userChats, {
            body: JSON.stringify({
                collocutor_name: collocutor,
            })
        });
    }
    static getChatById(chatId) {
        return this.requestGET(urls.chatById.replace(':id', chatId));
    }
    static getUserChats() {
        return this.requestGET(urls.userChats);
    }
    static markChatAsRead(chatId) {
        return this.requestPUT(urls.userChats, {
            body: JSON.stringify({
                chat_id: chatId,
            })
        })
    }

    static sendReport(data) {
        return this.requestPOST(urls.report, {
            body: JSON.stringify({
                ...data,
            })
        })
    }
}