import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { BASE_URL } from '../utils/constants'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from "../utils/userSlice"

const Body = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector(store => store.user);

    const fetchUser = async () => {
        if (userData) return;
        try {
            const res = await axios.get(BASE_URL + "/profile/view", {
                withCredentials: true,
            });
            dispatch(addUser(res.data));
        } catch (err) {
            if (err.status === 401) {
                navigate("/login");
            }

            console.log(err);
        }
    };

    useEffect(() => {

        fetchUser();


    }, [])

    return (
        <>
            <div className="flex flex-col h-screen">
                <NavBar />

                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>

                <Footer />
            </div>


        </>
    )
}

export default Body