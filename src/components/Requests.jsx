import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);

    const reviewRequests = async (status, _id) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/request/review/${status}/${_id}`,
                {},
                { withCredentials: true }
            );
            await fetchReq(); // Refresh requests after action
        } catch (err) {
            console.error("Error reviewing request:", err);
        }
    };

    const fetchReq = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/requests/received`, {
                withCredentials: true,
            });
            dispatch(addRequests(res.data.data));
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    };

    useEffect(() => {
        fetchReq();
    }, []);

    return (
        <div className="flex justify-center mt-8">
            <div className="max-w-2xl w-full bg-white/10 border border-white/20 rounded-3xl shadow-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Requests Received
                </h1>

                {requests.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No requests received yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={req.fromUserId.photoUrl}
                                        alt={`${req.fromUserId.firstName} ${req.fromUserId.lastName}`}
                                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {req.fromUserId.firstName} {req.fromUserId.lastName}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {req.fromUserId.about || "No headline"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-1 bg-green-500 hover:bg-green-600 text-sm rounded-xl"
                                        onClick={() => reviewRequests("accepted", req._id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-sm rounded-xl"
                                        onClick={() => reviewRequests("rejected", req._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
