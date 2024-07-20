import Razorpay from "razorpay";
import config from "../../constants/config.js";
import LogModule from "../log/index.js";
import asyncLocalStorage from "../../util/asyncStorage.js";

const PaymentInstance = new Razorpay({
	key_id: config.RAZORPAY_KEY_ID,
	key_secret: config.RAZORPAY_KEY_SECRET,
});

const log = async (data, key2, metric) => {
	const txnId = asyncLocalStorage.getStore();
	LogModule.log({
		data: JSON.stringify(data),
		key1: 'pgQueries',
		key2,
		txnId,
		metric,
	})
}

const createPaymentOrder = async ({ userId, orderId, amount }) => {
	const startTime = Date.now();
	const result = await PaymentInstance.orders.create({
		amount: +amount * 100,
		currency: "INR",
		notes: {
			userId,
			orderId,
		},
	});
	log({ data: { userId, orderId, amount }, result }, 'createPaymentOrder', Date.now() - startTime);
	return result;
};

const getPaymentOrder = async (orderId) => {
	const startTime = Date.now();
	const result = await PaymentInstance.orders.fetch(orderId);
	log({ orderId, result }, 'getPaymentOrder', Date.now() - startTime);
	return result;
};

const checkPaymentStatus = async (paymentId) => {
	const startTime = Date.now();
	const result = await PaymentInstance.payments.fetch(paymentId);
	log({ paymentId, result }, 'checkPaymentStatus', Date.now() - startTime);
	return result;
};

const refundPayment = async (paymentId) => {
	const startTime = Date.now();
	const result = PaymentInstance.payments.refund(paymentId);
	log({ paymentId, result }, 'refundPayment', Date.now() - startTime);
	return result;
};

export default {
	createPaymentOrder,
	checkPaymentStatus,
	getPaymentOrder,
	refundPayment,
}