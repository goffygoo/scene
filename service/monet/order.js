import { ORDER_STATUS, PG_PAYMENT_STATUS } from "../../constants/index.js";
import Event from "../../model/Event.js";
import Order from "../../model/Order.js"
import Receipt from "../../model/Receipt.js";
import dlm from "../../util/dlm.js";
import PaymentModule from "./payment.js"

const createHelper = async ({
    eventId,
    amount,
    userId,
}) => {
    const [event, receipt] = await Promise.all([
        Event.findByIdAndSelect(eventId, {
            price: 1,
        }),
        Receipt.findOne({
            eventId,
            userId
        })
    ])
    if (event.price !== amount) throw Error('Invalid amount');
    if (receipt) throw Error('Already Paid');
    const order = await Order.create({
        userId,
        eventId,
        amount,
    });
    const paymentOrder = await PaymentModule.createPaymentOrder(order);
    await Order.findByIdAndUpdate(order._id, {
        pgOrderId: paymentOrder.id,
    });
    return {
        pgOrderId: paymentOrder.id,
    }
}

const create = async ({
    eventId,
    amount,
    userId,
}) => {
    const lockKey = `order_${eventId}_${userId}`;
    return dlm(lockKey, () => createHelper({
        amount,
        eventId,
        userId,
    }), 10);
}

const refundOrder = async ({
    pgPaymentId,
    orderId
}) => {
    await PaymentModule.refundPayment(pgPaymentId);
    await Order.findByIdAndUpdate(orderId, {
        status: ORDER_STATUS.REFUNDED,
        pgPaymentId
    });
}

const paymentFailed = async ({
    pgPaymentId,
    orderId
}) => {
    const order = await Order.findById(orderId);
    if (order.status === ORDER_STATUS.CREATED) {
        await Order.findByIdAndUpdate(order._id, {
            status: ORDER_STATUS.FAILED,
            pgPaymentId
        })
    }
    return {
        payment: false,
    }
}

const paymentSuccess = async ({
    pgPaymentId,
    orderId
}) => {
    const order = await Order.findById(orderId);
    if (!order || order?.status === ORDER_STATUS.SUCCESS) {
        await refundOrder({ orderId, pgPaymentId });
        return {
            refunded: true,
            payment: order?.status === ORDER_STATUS.SUCCESS,
        };
    }
    const prevReceipt = await Receipt.findOne({
        userId: order.userId,
        eventId: order.eventId,
    });
    if (prevReceipt) {
        await refundOrder({ orderId, pgPaymentId });
        return {
            refunded: true,
            payment: true,
        }
    }
    await Order.findByIdAndUpdate(orderId, {
        status: ORDER_STATUS.SUCCESS,
        pgPaymentId
    });
    await Receipt.create({
        orderId: order._id,
        userId: order.userId,
        eventId: order.eventId,
    });
    // TODO: add ticket;
    return {
        payment: true,
    }
}

const confirmPayment = async (pgPaymentId, checkPaymentPre) => {
    const checkPayment = checkPaymentPre ?? await PaymentModule.checkPaymentStatus(pgPaymentId);
    const params = {
        pgPaymentId,
        orderId: checkPayment.notes.orderId
    }
    if (checkPayment.status === PG_PAYMENT_STATUS.CAPTURED) {
        return paymentSuccess(params);
    } else if (checkPayment.status === PG_PAYMENT_STATUS.FAILED) {
        return paymentFailed(params);
    }
    return {
        refunded: true,
    }
}

export default {
    create,
    confirmPayment,
}