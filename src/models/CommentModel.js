import request from "../modules/request/Request.js";

class CommentModel {
    constructor() {}

    createComment(data={}) {
        return request.commentPost(data).then((response) => {
            return response.json();
        })
    }
}

export default new CommentModel();