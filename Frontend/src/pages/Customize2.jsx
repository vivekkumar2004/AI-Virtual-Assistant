import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";

const Customize2 = () => {

    const {userData} = useContext(UserDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
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
      {assistantName && <button className="min-w-[250px] h-[60px] mt-[30px] bg-white rounded-full text-black text-[19px] font-semibold cursor-pointer" onClick={()=> navigate("/customize2")}>Create Your Assistant</button>}
      
    </div>
  );
};

export default Customize2;
