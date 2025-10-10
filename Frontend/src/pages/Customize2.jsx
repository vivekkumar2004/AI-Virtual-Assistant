import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {

    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(UserDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleUpdateAssistant = async ()=>{
      try {
        let formData = new FormData()
        formData.append("assistantName", assistantName)
        if(backendImage){
          formData.append("assistantImage", backendImage)
        }else{
          formData.append("imageUrl", selectedImage)
        }
        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})

        console.log(result.data);
        setUserData(result.data)
        
      } catch (error) {
        console.log(error); 
      }
    }



  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
      <IoArrowBackOutline className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=> navigate("/customize")}/>
      <h1 className="text-white mb-[30px] text-[30px] text-center">
        Enter Your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg. shifra"
        className="w-full max-w-[500px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
        onChange={(e)=> setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && <button className="min-w-[250px] h-[60px] mt-[30px] bg-white rounded-full text-black text-[19px] font-semibold cursor-pointer" disabled={loading} onClick={()=>{
        handleUpdateAssistant()
        }}>{!loading ?"Create Your Assistant": "Loading...."}</button>}
      
    </div>
  );
};

export default Customize2;
