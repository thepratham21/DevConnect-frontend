import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";

const Payment = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        const order = await axios.post(
            BASE_URL + "/payment/create",
            { typeofPlan: "premium" },
            { withCredentials: true }
        );

        //open razorpay payment gateway

        const { amount, currency, keyId, notes, orderId, } = order.data;

        var options = {
            "key": keyId, 
            "amount": amount,
            "currency": currency,
            "name": "DevConnect Premium",
            "description": "Access exclusive features and chat with developers",
            
            "order_id": orderId,
            "handler": function (response) {
                // This function is called on successful payment
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
                // Send these details to your backend for payment verification
            },
            "prefill": {
                "name": notes.firstName + " " + notes.lastName,
                "email": notes.emailId,
                
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };



        const rzp = new window.Razorpay(options);
        rzp.open();



    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col items-center justify-center px-6 py-16">
            {!isPaid ? (
                <div className="bg-[#121212] border border-gray-700 rounded-2xl p-10 w-full max-w-md shadow-lg hover:border-indigo-500 transition-all duration-300">
                    <h1 className="text-3xl font-bold text-white text-center mb-4">
                        Upgrade to <span className="text-indigo-500">Premium</span>
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        Unlock chat and connect directly with like-minded developers.
                    </p>

                    {/* Price Section */}
                    <div className="text-center mb-6">
                        <h2 className="text-5xl font-extrabold text-indigo-400 mb-2">
                            ₹49
                        </h2>
                        <p className="text-gray-400">per month</p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${isProcessing
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                    >
                        {isProcessing ? "Processing..." : "Pay ₹49 Now"}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Secure payment powered by Razorpay
                    </p>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-700/10 border border-indigo-500 rounded-2xl p-10 text-center shadow-[0_0_25px_rgba(99,102,241,0.3)]">
                    <h1 className="text-3xl font-bold text-indigo-400 mb-4">
                        Payment Successful !
                    </h1>
                    <p className="text-gray-300 mb-6">
                        Welcome to <span className="text-white font-semibold">DevConnect Premium</span>!
                        You can now chat with other developers and unlock exclusive features.
                    </p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-300"
                    >
                        Go to Home
                    </button>
                </div>
            )}
        </div>
    );
};

export default Payment;
