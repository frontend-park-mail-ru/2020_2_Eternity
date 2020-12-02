export const apiPath = 'api'

export const urls = {
    signup: `/${apiPath}/user/signup`,
    login: `/${apiPath}/user/login`,
    logout: `/${apiPath}/user/logout`,

    avatar: `/${apiPath}/user/profile/avatar`,
    updatePassword: `/${apiPath}/user/profile/password`,
    updateProfile: `/${apiPath}/user/profile`,

    profile: `/${apiPath}/user/profile`,
    userProfile: `/${apiPath}/userpage/:username`,

    feed: `/${apiPath}/feed:option`,
    search: `/${apiPath}/search?type=:type&content=:content:last`,
    pins: `/${apiPath}/user/pins/:username`,

    boardPost: `/${apiPath}/board`,
    board: `/${apiPath}/board/:id`,
    boards: `/${apiPath}/boards/:username`,
    attachPin: `/${apiPath}/attach`,
    detachPin: `/${apiPath}/detach`,
    boardPins: `/${apiPath}/pins/board/:id`,

    pin: `/${apiPath}/user/pin/:id`,
    pinPost: `/${apiPath}/user/pin`,
    pinComments: `/${apiPath}/pin/:id/comments`,

    pinCommentPost: `/${apiPath}/pin/comments`,

    follow: `/${apiPath}/follow`,

    ws: `/ws`,
    userChats: `/${apiPath}/chat`,
    chatById: `/${apiPath}/chat/:id`,
}

