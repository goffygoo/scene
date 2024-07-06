import admin from 'firebase-admin';
import User from '../../model/User.js';
import { FCM_EVENTS } from '../../constants/index.js';

const pushToUserWithData = async ({ userId, title, body, data }) => {
    const user = await User.findOneAndPopulate({ _id: userId }, "devices");
    const devices = user.devices;
    const tokensArr = devices.map(device => device.fcmToken);
    const tokens = [...(new Set(tokensArr))];
    const batchResponse = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
            title,
            body,
        },
        data,
    });
    const crashedDevice = [];
    for (let i = 0; i < batchResponse.responses.length; i++) {
        if (batchResponse?.responses[i]?.error) {
            crashedDevice.push(devices[i]._id);
        }
    }
    if (crashedDevice.length) {
        await User.findByIdAndUpdate(user._id, {
            $pull: { devices: { $in: crashedDevice } }
        })
    }
}

const helpChat = async (userId, data) => {
    await pushToUserWithData({
        userId,
        title: "Message from Support",
        body: "New message recieved from Scene Support",
        data: {
            ...data,
            fcmEvent: FCM_EVENTS.HELP_CHAT,
        }
    })
}

export default {
    pushToUser: {
        helpChat
    }
}