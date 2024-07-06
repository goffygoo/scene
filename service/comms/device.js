import DeviceData from "../../model/DeviceData.js"
import User from "../../model/User.js";

const upsertDetails = async ({
    device,
    appVersion,
    deviceId,
    fcmToken,
    bundleVersion,
    userId
}) => {
    let currentDeviceId = deviceId;
    if (!deviceId) {
        const deviceData = await DeviceData.create({
            device,
            appVersion,
            fcmToken,
            bundleVersion,
        });
        currentDeviceId = deviceData._id.toString();
    } else {
        await DeviceData.findByIdAndUpdate(deviceId, {
            device,
            appVersion,
            fcmToken,
            bundleVersion,
        });
    }
    if (userId) {
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                devices: currentDeviceId
            }
        })
    }
    return currentDeviceId;
}

export default {
    upsertDetails,
}