import React, { useState } from "react";
import UserContext from "./UserContext";
import { UserServiceApis } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const getUserInformation = async (token) => {
        UserServiceApis.getUserInfo({ token })
            .then((response) => {
                if (response.status === 209) {
                    toast.error('Session expired, please login again');
                    localStorage.removeItem("RLQ_Token");
                    navigate("/");
                    return;
                }
                if (response.data.status === true) {
                    setUser({ ...response.data.data, token });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const logoutUser = () => {
        localStorage.removeItem("RLQ_Token");
        setUser(null);
        navigate("/");
        toast.success('Logged out successfully');
    }


    return (
        <UserContext.Provider value={{ user, getUserInformation, logoutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider