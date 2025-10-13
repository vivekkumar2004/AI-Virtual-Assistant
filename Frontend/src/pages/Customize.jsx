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
import GradientButton from "../style/GradientButton";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate();

  const inputImage = useRef(); 

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] overflow-auto">
      <IoArrowBackOutline
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1
        className=" mb-[30px] text-[30px] font-extrabold tracking-wider p-2 text-center
        bg-gradient-to-r from-teal-300 via-sky-400 to-indigo-500 text-transparent bg-clip-text 
        drop-shadow-[0_0_8px_rgba(74,20,140,0.8)] sm:text-[40px]"
      >
        Choose Your Assistant's Avatar
      </h1>

      <div className="w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-8">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <Card image={authBg} />

        <div
          className={`w-[70px] h-[140px] lg:w-[140px] lg:h-[200px] bg-[#030326] border-2 border-[#0000ff60] rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center transition-all duration-300
            hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(60,180,255,0.7)] ${
              selectedImage == "input"
                ? "border-4 border-white shadow-2xl shadow-blue-950 scale-[1.05]"
                : "hover:border-blue-400"
            }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <RiFileUploadFill className="text-white w-[25px] h-[25px]" />
          )}

          {frontendImage && (
            <img src={frontendImage} className="h-full w-full object-cover" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <GradientButton
          className="mt-[40px]"
          onClick={() => navigate("/customize2")}
        >
          Next
        </GradientButton>
      )}
    </div>
  );
};

export default Customize;
