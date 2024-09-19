import { EditIcon } from 'lucide-react';
import React from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const profilePic = user.avatar;

  return (
    <div className="rounded-r-2xl p-6 shadow-lg w-full max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center justify-between pb-6 border-b border-black">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative w-32 h-32">
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
            <button className="absolute right-0 bottom-0 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 transition-transform transform hover:scale-110">
              <EditIcon size={18} />
            </button>
          </div>

          {/* User Info */}
          <div>
            <p className="text-2xl font-bold text-gray-800">{user.username}</p>
            <p className="text-md text-gray-700">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Task Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg shadow-gray-700 hover:shadow-lg transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">Total Tasks</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">45</p>
        </div>
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg shadow-gray-700 hover:shadow-lg transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">Completed Tasks</h3>
          <p className="text-3xl font-bold text-blue-500 mt-2">30</p>
        </div>
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg shadow-gray-700 hover:shadow-lg transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">Pending Tasks</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">15</p>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="mt-8 p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Account Settings</h3>
        <div className="flex justify-between">
          <a
            href="#"
            className="text-indigo-600 hover:underline transition-all"
          >
            Change Password
          </a>
          <a
            href="#"
            className="text-indigo-600 hover:underline transition-all"
          >
            Notification Preferences
          </a>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-6 p-4">
        <h3 className="font-semibold mb-2">Achievements</h3>
        <p className="text-gray-800">
          You’ve completed <span className="font-bold">30 tasks</span> this month!
          Keep up the great work!
        </p>
      </div>
    </div>
  );
};

export default Profile;
