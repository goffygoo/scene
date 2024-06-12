import admin from 'firebase-admin';
import UserData from '../../model/UserData.js';

const pushToUser = async (userId) => {
    const userData = await UserData.findOne({ userId });
    const tokens = userData.fcmTokens;
    const batchResponse = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
            title: "my title",
            body: "my body"
        }
    });
    const cleanTokens = [];
    for (let i = 0; i < batchResponse.responses.length; i++) {
        if (!response.responses[i].error) {
            cleanTokens.push(tokens[i]);
        }
    }
    if (cleanTokens.length != tokens.length) {
        await UserData.findByIdAndUpdate(userData._id, {
            fcmTokens: cleanTokens
        })
    }
}

const addFCMToken = async (userId, fcmToken) => {
    const userData = await UserData.findOne({ userId });
    const tokens = userData.fcmTokens;
    const newFcmTokens = [...(new Set([...tokens, fcmToken]))];
    await UserData.findByIdAndUpdate(userData._id, {
        fcmTokens: newFcmTokens
    })
}

export default {
    pushToUser,
    addFCMToken
}