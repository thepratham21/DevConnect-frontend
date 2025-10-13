import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';

const Connections = () => {
  const connections = useSelector(store => store.connections);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        const connectionsArray = Array.isArray(res.data.data) ? res.data.data : [];
        dispatch(addConnections(connectionsArray));
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    fetchConnections();
  }, [dispatch]);

  if (!connections) {
    return <div className="flex justify-center mt-10 text-gray-400">Loading connections...</div>;
  }

  if (connections.length === 0) {
    return <div className="flex justify-center mt-10 text-gray-400">No connections found.</div>;
  }

  return (
    <div className="flex flex-col items-center my-10">
      <h1 className="font-bold text-2xl text-white mb-6">
        Connections ({connections.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {connections.map((conn) => (
          <div
            key={conn._id}
            className="p-4 bg-zinc-900 rounded-2xl border border-white/10 shadow-md hover:shadow-white/10 transition"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={conn.photoUrl || "/default-avatar.png"}
                alt="profile"
                className="w-14 h-14 rounded-full object-cover border border-white/20"
              />
              <div>
                <h2 className="text-white font-semibold">
                  {conn.firstName} {conn.lastName}
                </h2>
                <p className="text-gray-400 text-sm">{conn.about || "Developer"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {conn.skills && conn.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-800 text-white rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
