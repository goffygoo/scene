import DeviceData from "../../model/DeviceData.js"
import User from "../../model/User.js";

const upsertDetails = async ({
    device,
    appVersion,
    deviceId,
    fcmToken,
    bundleVersion,
    userId,
    city,
}) => {
    let currentDeviceId = deviceId;
    if (!deviceId) {
        const deviceData = await DeviceData.create({
            ...(device && { device }),
            ...(appVersion && { appVersion }),
            ...(fcmToken && { fcmToken }),
            ...(bundleVersion && { bundleVersion }),
            ...(city && { appxCity: city }),
        });
        currentDeviceId = deviceData._id.toString();
    } else {
        await DeviceData.findByIdAndUpdate(deviceId, {
            ...(device && { device }),
            ...(appVersion && { appVersion }),
            ...(fcmToken && { fcmToken }),
            ...(bundleVersion && { bundleVersion }),
            ...(city && { appxCity: city }),
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