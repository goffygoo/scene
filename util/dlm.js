import DistributedLock from "../model/DistributedLock.js";

const ApiTimeOut = 29000;
const RetryTime = 1000;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const timeLimitedCall = async (fn) => {
    const timeout = setTimeout(() => {
        throw Error("Killed for timeout")
    }, ApiTimeOut);
    try {
        const value = await fn();
        clearTimeout(timeout);
        return value;
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

const accquireLock = async (key) => {
    try {
        await DistributedLock.create({ key });
        return true;
    } catch (err) {
        return false;
    };
}

const releaseLock = async (key) => {
    await DistributedLock.deleteOne({ key });
}

const DistributedLockManager = async (key, fn, retires) => {
    const lock = await accquireLock(key);
    if (!lock && retires === 0) {
        throw Error('Deadlock !!!');
    } else if (!lock) {
        await sleep(RetryTime);
        return DistributedLockManager(key, fn, retires - 1);
    } else {
        try {
            const response = await timeLimitedCall(fn);
            await releaseLock(key);
            return response;
        } catch (err) {
            await releaseLock(key);
            throw err;
        }
    }
}

export default async function (key, fn, retires = 1) {
    return DistributedLockManager(key, fn, retires);
};