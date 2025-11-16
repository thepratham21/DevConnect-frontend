import React from "react";
import { useNavigate } from "react-router-dom";

const Premium = () => {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        // You’ll later connect this to your Stripe / Razorpay logic
        navigate("/payment");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col items-center py-16 px-6">
            {/* Header */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Upgrade to <span className="text-indigo-500">DevConnect Premium</span>
            </h1>
            <p className="text-gray-400 text-center max-w-2xl mb-12">
                Connect deeper, collaborate better — unlock premium features and grow your network of like-minded developers.
            </p>

            {/* Comparison Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {/* Free Plan */}
                <div className="bg-[#121212] border border-gray-700 rounded-2xl p-8 hover:border-indigo-500 transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Free Tier</h2>
                    <p className="text-gray-400 mb-6">
                        Start your DevConnect journey for free and build your professional profile.
                    </p>
                    <ul className="space-y-3 text-gray-300">
                        <li>✅ Create profile & showcase skills</li>
                        <li>✅ Post updates and projects</li>
                        <li>✅ Send connection requests</li>
                        <li>🚫 Chat with other developers</li>
                    </ul>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-700/10 border border-indigo-500 rounded-2xl p-8 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Premium Tier</h2>
                    <p className="text-gray-300 mb-6">
                        Take your collaboration to the next level and unlock all DevConnect features.
                    </p>
                    <ul className="space-y-3 text-gray-200">
                        <li>✨ All Free Tier benefits</li>
                        <li>💬 Chat with like-minded developers</li>
                        <li>⚡ Priority visibility in the feed</li>
                        <li>🎯 Early access to new features</li>
                    </ul>

                    <button
                        onClick={handleUpgrade}
                        className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300"
                    >
                        Upgrade to Premium
                    </button>
                </div>
            </div>

            {/* Footer */}
            <p className="text-gray-500 mt-12 text-sm">
                Secure payment powered by Stripe / Razorpay.
            </p>
        </div>
    );
};

export default Premium;
