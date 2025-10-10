import React from "react";

const UserCard = ({ user }) => {
    return (
        <div className="w-80 bg-black border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-200">
            <div className="relative h-96">
                {/* Profile Image */}
                <img
                    src={user.photoUrl || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
                    {/* User Name and Age */}
                    <h2 className="text-white font-bold text-xl">
                        {user.firstName} {user.lastName}, {user.age || "N/A"}
                    </h2>

                    {/* Gender */}
                    {user.gender && (
                        <p className="text-white/70 text-sm mt-1">{user.gender}</p>
                    )}

                    {/* About Section */}
                    {user.about && (
                        <p className="text-white/70 text-sm mt-2 line-clamp-3">
                            {user.about}
                        </p>
                    )}

                    {/* Skills (Top 5 only + optional "+N more") */}
                    {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.skills.slice(0, 5).map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                            {user.skills.length > 5 && (
                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                    +{user.skills.length - 5} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Buttons Design */}
                    <div className="flex gap-4 mt-4">
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
                            Interested
                        </button>
                        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
                            Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
