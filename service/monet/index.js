import config from "../../constants/config.js";
import OrderModule from "./order.js";

const createOrder = async ({ body, locals }) => {
    const { eventId, amount } = body;
    const { userData } = locals;
    const { userId } = userData;
    const response = await OrderModule.create({
        amount,
        eventId,
        userId  
    });
    return {
        ...response,
        pgKey: config.RAZORPAY_KEY_ID,
    }
}

const confirmPayment = async ({ body, locals }) => {
    const { pgPaymentId } = body;
    const { userData } = locals;
    const { userId } = userData;


}

export default {
    service: {
        createOrder,
        confirmPayment,
    },
}