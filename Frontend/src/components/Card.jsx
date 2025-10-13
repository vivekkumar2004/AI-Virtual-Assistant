import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  // Destructure only the necessary context values for this component
  const { setBackendImage, setFrontendImage, selectedImage, setSelectedImage } =
    useContext(UserDataContext);

  // Define the base and hover classes
  const baseClasses =
    "w-[70px] h-[140px] lg:w-[130px] lg:h-[200px] bg-[#030326] border-2 border-[#0000ff60] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300";

  // Define the hover and lift-up effect classes
  const hoverEffectClasses =
    "hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(60,180,255,0.7)] hover:border-blue-400";

  // Define the classes when the card is selected
  const selectedClasses =
    "border-4 border-white shadow-2xl shadow-blue-950 scale-[1.05]";

  const isSelected = selectedImage === image;

  return (
    <div
      // 1. Combine base classes, hover effects, and conditional selected classes
      className={`${baseClasses} ${hoverEffectClasses} ${
        isSelected ? selectedClasses : ""
      }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null); // Resetting custom upload state
        setFrontendImage(null); // Resetting custom upload state
      }}
    >
      <img
        src={image}
        className="h-full w-full object-cover"
        alt="Assistant Avatar"
      />
    </div>
  );
};

export default Card;
