import DistributedLock from "../model/DistributedLock.js";

const ApiTimeOut = 2000;
const RetryTime = 2000;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const timeLimitedCall = async (fn) => {
    const [timeout, value] = await Promise.all([
        setTimeout(() => {
            throw Error("Killed for timeout")  
        }, ApiTimeOut),
        fn()
    ]);
    clearTimeout(timeout);
    return value;
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

const DistributedLockManager = async (key, fn, retry = true) => {
    const lock = await accquireLock(key);
    if (!lock && !retry) {
        throw Error('Deadlock !!!');
    } else if (!lock) {
        await sleep(RetryTime);
        return DistributedLock(key, fn, false);
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

export default async function (key, fn) {
    return DistributedLockManager(key, fn);
};