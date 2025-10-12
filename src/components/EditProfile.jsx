import React, { useState } from "react";
import { useEffect } from "react";
import UserCard from "./UserCard";

import axios from "axios";
import { BASE_URL } from '../utils/constants'
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills ? user.skills.join(", ") : "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills: skills.split(",").map(s => s.trim())
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000)


    } catch (err) {
      setError(err.message);
    }
  }



  return (
    <>

      <div className="flex justify-center">
        <div className="max-w-2xl mx-5 mt-6 p-4 bg-black border border-white/20 rounded-3xl shadow-xl">
          <h1 className="text-xl font-bold text-white mb-4">Edit Profile</h1>


          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-2">
              <img
                src={
                  photoUrl ||
                  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              placeholder="Image URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full max-w-xs p-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 text-sm mb-1">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1">Age</label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-white/70 text-sm mb-1">About</label>
              <textarea
                placeholder="About yourself"
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-white/70 text-sm mb-1">Skills</label>
              <input
                type="text"
                placeholder="Add skills separated by comma"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>


          <div className="mt-4 flex justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-2xl transition-colors text-sm"
              onClick={saveProfile}>

              Save Changes
            </button>
          </div>
        </div>

        <UserCard user={{ firstName, lastName, age, about, skills, gender, photoUrl }} />






      </div>


      {showToast && (
        <div className="toast toast-top toast-center">
        
        <div className="alert alert-success">
          <span>Profile Updated successfully</span>
        </div>
      </div>
     
      )}





    </>
  );
};

export default EditProfile;
