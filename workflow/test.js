import _db from '../util/db.js';
import CommsModule from "../service/comms/index.js";

const execute = async (params) => {
    const { userId } = params;
    await CommsModule.notification.pushToUser(userId);
}

export default execute;