import React from "react";

const Chat = () => {
    return (
        <div className="flex flex-col h-screen bg-base-100">

            {/* TOP BAR */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-200 border-b border-base-300 sticky top-0 z-20">

                {/* PLACEHOLDER for profile pic later */}
                <div className="w-12 h-12 rounded-full bg-base-300 animate-pulse" />

                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">James Rodriguez</h2>
                    <p className="text-xs text-gray-500">Online</p>
                </div>
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                
                {/* Other User Message */}
                <div className="flex items-start gap-2">

                    {/* Placeholder for avatar */}
                    <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />

                    <div className="max-w-[70%] bg-base-200 px-4 py-2 rounded-2xl shadow">
                        Hey, how’s your project going?
                    </div>
                </div>

                {/* You */}
                <div className="flex justify-end">
                    <div className="max-w-[70%] bg-primary text-primary-content px-4 py-2 rounded-2xl shadow">
                        Great! I just finished the chat UI. What about you?
                    </div>
                </div>

                {/* Other User Message */}
                <div className="flex items-start gap-2">

                    {/* Placeholder for avatar */}
                    <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />

                    <div className="max-w-[70%] bg-base-200 px-4 py-2 rounded-2xl shadow">
                        Nice! Looks clean. Let’s push it today.
                    </div>
                </div>

            </div>

            {/* INPUT BAR */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-200 border-t border-base-300 sticky bottom-0">
                <input 
                    className="input input-bordered w-full rounded-full"
                    placeholder="Type a message..."
                />
                <button className="btn btn-primary rounded-full px-6">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
