import _db from '../util/db.js';
import LogModule from "../service/log/index.js";

const execute = async (params) => {
    const { logStamp, eventStamp, errorStamp, feLogStamp } = params;
    await LogModule.dropIndexes({
        errorStamp,
        eventStamp,
        logStamp,
        feLogStamp,
    });
}

export default execute;