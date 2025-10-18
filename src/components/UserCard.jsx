import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";


const UserCard = ({ user }) => {

    const { _id } = user;

    const skillsArray = Array.isArray(user.skills)
        ? user.skills
        : typeof user.skills === "string"
            ? user.skills.split(",").map(s => s.trim())
            : [];

    const dispatch = useDispatch();

    const handleSendRequest = async (status, userId) => {
        try {
            const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {
                withCredentials: true,
            });

            dispatch(removeUserFromFeed(userId));

        } catch (err) {
            console.error("Error sending request:", err);
        }
    }

    return (
        <div className="w-80 mt-6 bg-black border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-200">
            <div className="relative h-96">
                <img
                    src={
                        user.photoUrl ||
                        "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
                    <h2 className="text-white font-bold text-xl">
                        {user.firstName} {user.lastName}, {user.age || "N/A"}
                    </h2>

                    {user.gender && (
                        <p className="text-white/70 text-sm mt-1">
                            {user.gender}
                        </p>
                    )}

                    {user.about && (
                        <p className="text-white/70 text-sm mt-2 line-clamp-3">
                            {user.about}
                        </p>
                    )}

                    {skillsArray.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skillsArray.slice(0, 5).map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                            {skillsArray.length > 5 && (
                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                    +{skillsArray.length - 5} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 mt-4">
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                        onClick={() => handleSendRequest("interested", _id)}
                        >
                            Interested
                        </button>
                        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                        onClick={() => handleSendRequest("ignored", _id)}
                        >
                            Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
