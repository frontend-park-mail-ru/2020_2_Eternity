export const requestTypeWS = {
    createMessage: 'CreateMessageReq',
    deleteMessage: 'DeleteMessageReq',
    getLastMessages: 'GetLastNMessagesReq',
    getHistoryMessages: 'GetNMessagesBeforeReq',
}

export const responseTypeWS = {
    createMessage: 'CreateMessageResp',
    deleteMessage: 'DeleteMessageResp',
    getLastMessages: 'GetLastNMessagesResp',
    getHistoryMessages: 'GetNMessagesBeforeResp',
    noteComment: 'NoteCommentResp',
    notePin: 'NotePinResp',
    noteFollow: 'NoteFollowResp',
    noteChat: 'NoteChatResp',
    noteMessage: 'NoteMessageResp',
}