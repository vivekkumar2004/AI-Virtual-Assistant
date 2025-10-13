import React, { useContext, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import Card from "../components/card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import authBg from "../assets/authBg.png";
import { RiFileUploadFill } from "react-icons/ri";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {

  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage, setSelectedImage} = useContext(UserDataContext)

  const navigate = useNavigate()

  const inputImage = useRef()

  const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }
};


  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
        <IoArrowBackOutline className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=> navigate("/")}/>
      <h1 className="text-white mb-[30px] text-[30px] text-center">Select your <span className="text-blue-200">Assistant Image</span></h1>
      <div className="w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-4">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <Card image={authBg} />

        <div className={`w-[170px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff60] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-400 cursor-pointer flex items-center justify-center ${selectedImage=="input"? "border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={()=> {
          inputImage.current.click()
          setSelectedImage("input")
          }}>
          {!frontendImage && <RiFileUploadFill  className="text-white w-[25px] h-[25px]"/>}
          {frontendImage && <img src={frontendImage} className="h-full object-cover"/>}
          
        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage && <button className="min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black text-[19px] font-semibold cursor-pointer" onClick={()=> navigate("/customize2")}>Next</button>}
      

    </div>
  );
};

export default Customize