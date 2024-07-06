import HelpModule from "../help/index.js";

const getMessages = async ({ body, locals }) => {
    const { fromTimestamp } = body;
    const { userData } = locals;
    const { userId } = userData;
    const messages = await HelpModule.support.getMessagesByUserId(userId, fromTimestamp);
    return {
        messages,
    }
}

const sendMessage = async ({ body, locals }) => {
    const { message } = body;
    const { userData } = locals;
    const { userId } = userData;
    await HelpModule.support.sendMessageByUser(userId, message);
}

export default {
    service: {
        sendMessage,
        getMessages,
    },
}