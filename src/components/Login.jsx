import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [about, setAbout] = useState('');
    const [skills, setSkills] = useState('');

    const handleSubmit = async () => {
        try {
            let res;
            setError(null);
            setSuccess(null);

            if (isLogin) {
                
                res = await axios.post(
                    `${BASE_URL}/login`,
                    { email, password },
                    { withCredentials: true }
                );
                dispatch(addUser(res.data));
                navigate('/');
            } else {
                
                await axios.post(
                    `${BASE_URL}/signup`,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                        age,
                        gender,
                        about,
                        skills: skills.split(',').map((s) => s.trim()),
                    },
                    { withCredentials: true }
                );
                
                setSuccess('Signed up successfully!');
                setTimeout(() => {
                    setIsLogin(true);
                    setSuccess(null);
                }, 2000);
            }
        } catch (err) {
            setError(err?.response?.data || 'Something went wrong');
        }
    };

    return (
        <div className="bg-black flex items-center justify-center p-4 min-h-screen">
            <div className="card bg-black border border-white/20 w-96">
                <div className="card-body p-8">
                    <h2 className="card-title justify-center text-2xl font-bold text-white mb-6">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </h2>

                    <div className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white">First Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter your first name"
                                        className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white">Last Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter your last name"
                                        className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white">Age</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Enter your age"
                                        className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white">Gender</span>
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="select bg-black border border-white/20 text-white focus:border-white/40 focus:outline-none transition-all duration-200"
                                    >
                                        <option value="" disabled>
                                            Select your gender
                                        </option>
                                        <option value="male" className="text-black">
                                            Male
                                        </option>
                                        <option value="female" className="text-black">
                                            Female
                                        </option>
                                        <option value="other" className="text-black">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white">About</span>
                                    </label>
                                    <textarea
                                        value={about}
                                        onChange={(e) => setAbout(e.target.value)}
                                        placeholder="Tell something about yourself"
                                        className="textarea bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                    ></textarea>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-white">Skills</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        placeholder="e.g. React, Node, MongoDB"
                                        className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                                    />
                                    <p className="text-xs text-white/50 mt-1">
                                        (Enter skills separated by commas)
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-white">Email</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="input bg-black border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-all duration-200"
                            />
                        </div>

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

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}

                    <div className="card-actions justify-center mt-6">
                        <button
                            className="btn btn-primary w-full bg-white text-black hover:bg-white/90 border-none font-semibold"
                            onClick={handleSubmit}
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="text-center mt-4 text-white/70">
                        {isLogin ? (
                            <>
                                Don’t have an account?{' '}
                                <span
                                    onClick={() => setIsLogin(false)}
                                    className="text-white hover:underline cursor-pointer"
                                >
                                    Sign Up
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <span
                                    onClick={() => setIsLogin(true)}
                                    className="text-white hover:underline cursor-pointer"
                                >
                                    Login
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
