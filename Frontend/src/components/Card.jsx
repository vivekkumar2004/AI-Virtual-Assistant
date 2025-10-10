import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Card = ({image}) => {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage} = useContext(UserDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff60] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-400 cursor-pointer ${selectedImage==image? "border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={()=> {
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)

    }}>
        <img src={image} className='h-full object-cover'/>

    </div>
  )
}

export default Card