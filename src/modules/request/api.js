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
    boardCover: `/${apiPath}/pins/board/:id?limit=3`,
    boards: `/${apiPath}/boards/:username`,
    attachPin: `/${apiPath}/attach`,
    detachPin: `/${apiPath}/detach`,
    boardPins: `/${apiPath}/pins/board/:id`,
    checkAttachingPin: `/${apiPath}/boards_pin/:pin_id`,

    pin: `/${apiPath}/user/pin/:id`,
    pinPost: `/${apiPath}/user/pin`,
    pinComments: `/${apiPath}/pin/:id/comments`,

    pinCommentPost: `/${apiPath}/pin/comments`,

    follow: `/${apiPath}/follow`,
    unfollow: `/${apiPath}/unfollow`,
    isFollowing: `/${apiPath}/isfollowing/:username`,
    followers: `/${apiPath}/followers/:username`,
    followings: `/${apiPath}/following/:username`,

    notifications: `/${apiPath}/notifications`,

    ws: `/ws`,
    userChats: `/${apiPath}/chat`,
    chatById: `/${apiPath}/chat/:id`,

    report: `/${apiPath}/report`,

    subfeed: `/${apiPath}/subfeed`,

    popular: `/${apiPath}/user/popular`,
}

