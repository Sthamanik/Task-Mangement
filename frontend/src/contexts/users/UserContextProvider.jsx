import { useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";

const UserContextProvider = ({ children }) => {
  const server = import.meta.env.VITE_HOST;
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); 

  const signupUser = async (userData) => {
    try {
      const response = await axios.post(`${server}/users/register`, userData);
      setUser(response.data.data.user);
      setError(null);
      return response.data;
    } catch (error) {
        if (error.status === 409){
            setError("Email already exists");
            return { success: false, message: "Email already exists" };  
        }
        if (error.status === 500){
            setError("Server error");
            return { success: false, message: "Server error" }; 
        }
      setError(error.response?.data || "Signup failed");
      return { success: false, message: error.message || "Signup failed" };
    }
  };

  const loginUser = async (userData) => {
    try {
      const response = await axios.post (`${server}/users/login`, userData);
      setUser(response.data.data.user);
      console.log(response.data.data.user)
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      setError(null);
      return response.data;
    } catch (error) {
      if (error.status === 401) {
        setError("Invalid email or password");
        return { success: false, message: "Invalid email or password" }; 
      }
      if (error.status === 404) {
        setError("User not found");
        return { success: false, message: "User not found" };
      }
      setError(error.response?.data || "Login failed");
      return { success: false, message: error.message || "Login failed" };
    }
  }

  const logoutUser= async () => {
    try {
      const response = await axios.put(`${server}/users/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return response.data;
    } catch (error) {
      console.error("Error logging out user:", error);
    }
  }

  const values = {
    signupUser,
    loginUser,
    logoutUser,
    user,
    error  // Expose error if needed
  };

  return (
    <UserContext.Provider value={values}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
