import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import GradientButton from "../style/GradientButton";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(UserDataContext); 
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    if (!assistantName.trim()) return; 
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName); 
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error("Update Assistant Error:", error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
      <IoArrowBackOutline
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1
        className=" mb-[30px] text-[30px] font-extrabold tracking-wider p-2 text-center
        bg-gradient-to-r from-teal-300 via-sky-400 to-indigo-500 text-transparent bg-clip-text 
        drop-shadow-[0_0_8px_rgba(74,20,140,0.8)] sm:text-[40px]"
      >
        Name Your Assistant
      </h1>
      <input
        type="text"
        placeholder="e.g., Jarvis, Shifra, or Alpha"
        className="w-full max-w-[500px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] focus:border-blue-400 focus:shadow-[0_0_15px_rgba(60,180,255,0.7)] transition-all duration-200"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName.trim() && (
        <GradientButton
          className="mt-[40px]"
          onClick={handleUpdateAssistant}
          disabled={loading}
        >
          {!loading ? "Create Your Assistant" : "Loading..."}
        </GradientButton>
      )}
    </div>
  );
};

export default Customize2;
