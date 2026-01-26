import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { MessageSquare } from "lucide-react";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                BASE_URL + "/logout",
                {},
                { withCredentials: true }
            );
            dispatch(removeUser());
            navigate("/login");
        } catch (err) {
            console.log("Error during logout:", err);
        }
    };

    return (
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-base-200/70 border-b border-base-300">
            <div className="navbar max-w-7xl mx-auto px-4">
                
                
                <div className="flex-1">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-white hover:text-white/90 transition"

                    >
                        DevConnect
                    </Link>
                </div>

                
                {user && (
                    <div className="flex items-center gap-4">
                        
                        
                        <Link
                            to="/inbox"
                            className="btn btn-ghost btn-circle relative"
                        >
                            <MessageSquare className="w-5 h-5" />
                            
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></span>
                        </Link>

                        
                        <div className="hidden sm:block text-sm opacity-80">
                            Hi, <span className="font-medium">{user.firstName}</span>
                        </div>

                        
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User"
                                        src={user.photoUrl}
                                    />
                                </div>
                            </div>

                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-4 w-56 rounded-2xl bg-base-100 shadow-xl border border-base-300"
                            >
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li>
                                    <Link to="/feed">Explore Friends</Link>
                                </li>
                                <li>
                                    <Link to="/connections">Connections</Link>
                                </li>
                                <li>
                                    <Link to="/requests">Requests</Link>
                                </li>
                                <li>
                                    <Link to="/premium">Premium</Link>
                                </li>
                                <li>
                                    <Link to="/inbox">Inbox</Link>
                                </li>

                                <div className="divider my-1"></div>

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="text-error"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;
