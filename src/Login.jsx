import axios from 'axios';
import React, { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try{
            const res = await axios.post("http://localhost:7000/login", {
            email,
            password,
        },
        {
            withCredentials:true
        }
    );
        }catch(err){
            console.error(err);
        }
    }

    return (
        <>
            <div className=" bg-black flex items-center justify-center p-4">
                <div className="card bg-black border border-white/20 w-96">
                    <div className="card-body p-8">
                        {/* Title */}
                        <h2 className="card-title justify-center text-2xl font-bold text-white mb-6">
                            Login
                        </h2>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-white">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail (e.target.value)}
                                    placeholder="Enter your email"
                                    className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-white">Password</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="text-right mt-2">
                            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors duration-200">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <div className="card-actions justify-center mt-6">
                            <button className="btn btn-primary w-full bg-white text-black hover:bg-white/90 border-none font-semibold" onClick={handleLogin}>
                                Login
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login