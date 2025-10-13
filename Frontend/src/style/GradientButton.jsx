

import React from "react";


const GradientButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
  shadowColor = "purple",
  size = "lg", // 'lg' for large, 'sm' for small
  type = "button",
}) => {
  // Determine gradient based on shadowColor (red for Logout, default for others)
  const gradientClass =
    shadowColor === "red"
      ? "from-red-500 via-pink-500 to-orange-500" // Red-themed gradient
      : "from-purple-500 via-red-500 to-yellow-500"; // Default (purple-themed) gradient

  // Determine shadow color and opacity (using a higher opacity for a stronger glow)
  const shadowClass =
    shadowColor === "red"
      ? "hover:shadow-red-600/60" // Stronger Red Glow
      : "hover:shadow-purple-600/60"; // Stronger Purple Glow
      
  // Determine size classes
  const sizeClasses = size === 'lg'
    ? 'h-16 w-[160px] sm:w-[250px] p-[2px] text-lg sm:text-xl' // Large size for main actions
    : 'h-15 w-[200px] p-[1.5px] text-base'; // Small size for sidebar

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      // Outer Button (Gradient Border) - Combines base styles, size, shadow, and custom classes
      className={`group flex mx-auto items-center justify-center rounded-full bg-gradient-to-r ${gradientClass} ${sizeClasses} text-white duration-300 hover:bg-gradient-to-l hover:shadow-2xl ${shadowClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* Inner Div (The Actual Button Surface) */}
      <div
        className={`flex h-full w-full items-center justify-center rounded-full bg-gray-900 transition duration-300 ease-in-out 
          group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 
          font-bold tracking-wider cursor-pointer`}
      >
        {children}
      </div>
    </button>
  );
};

export default GradientButton;