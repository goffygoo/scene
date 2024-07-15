import Razorpay from "razorpay";
import config from "../../constants/config.js";

const PaymentInstance = new Razorpay({
	key_id: config.RAZORPAY_KEY_ID,
	key_secret: config.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async ({ userId, orderId, amount }) => {
	return PaymentInstance.orders.create({
		amount: +amount * 100,
		currency: "INR",
		notes: {
			userId,
			orderId,
		},
	});
};

const getPaymentOrder = async (orderId) => {
	return PaymentInstance.orders.fetch(orderId);
};

const checkPaymentStatus = async (paymentId) => {
	return PaymentInstance.payments.fetch(paymentId);
};

const refundPayment = async (paymentId) => {
	return PaymentInstance.payments.refund(paymentId)
};

export default {
    createPaymentOrder,
	checkPaymentStatus,
	getPaymentOrder,
	refundPayment,
}