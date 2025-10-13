import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";

import { HiOutlineMenuAlt3 } from "react-icons/hi";
import user from "../assets/user.gif";
import { GiCrossMark } from "react-icons/gi";
import GradientButton from "../style/GradientButton";

const Home = () => {
  const [ham, setHam] = useState(false);
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const manualStopRef = useRef(false);

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const [voiceUnlocked, setVoiceUnlocked] = useState(false);
  const synth = window.speechSynthesis; 

  const speak = (text) => {
    if (!synth) return;
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }

    isSpeakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      if (recognitionRef.current && !manualStopRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.log("Recognition restart error:", err);
        }
      }
    };

    synth.cancel();
    if (voiceUnlocked) synth.speak(utterance);
  }; //  Logout

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  }; 

  useEffect(() => {
    const unlockAudio = () => {
      const test = new SpeechSynthesisUtterance("Voice enabled!");
      synth.speak(test);
      setVoiceUnlocked(true);
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
  }, [synth]); 



  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    switch (
      type // ---  SEARCH COMMANDS ---
    ) {
      case "google_search":
      case "weather_show": 
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;
      case "amazon_search": 
        window.open(
          `https://www.amazon.com/s?k=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;
      case "spotify_search": 
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(
            userInput
          )}+site:open.spotify.com`,
          "_blank"
        );
        break;
      case "flipkart_search":
        window.open(
          `https://www.flipkart.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;
      case "netflix_search": 
        window.open(
          `https://www.netflix.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;
      case "youtube_search":
      case "youtube_play":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userInput
          )}`,
          "_blank"
        );
        break; 
      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "netflix_open": 
        window.open("https://www.netflix.com", "_blank");
        break;
      case "flipkart_open": 
        window.open("https://www.flipkart.com", "_blank");
        break;
      case "spotify_open":
        window.open("https://open.spotify.com", "_blank");
        break;
      case "linkedin_open": 
        window.open("https://www.linkedin.com", "_blank");
        break;
      case "x_open": 
        window.open("https://x.com", "_blank");
        break;
      case "amazon_open": 
        window.open("https://www.amazon.com", "_blank");
        break;
      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        break;
      case "youtube_open":
        window.open("https://www.youtube.com", "_blank");
        break;
      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        break;

      default:
        break;
    }
  }; //  Speech Recognition

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return console.error("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setAiText("");
      if (!isSpeakingRef.current && !manualStopRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {}
        }, 200);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {}
        }, 500);
      }
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (userData && transcript.length > 0) {
        manualStopRef.current = true;
        try {
          setAiText("");
          setUserText(transcript);
          recognition.stop();
        } catch (err) {}
        isRecognizingRef.current = false;

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setUserText("");
        setAiText(data.response);
        manualStopRef.current = false;
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.log("Initial recognition start error:", err);
    }

    return () => {
      manualStopRef.current = true;
      try {
        recognition.stop();
      } catch (err) {}
      isRecognizingRef.current = false;
    };
  }, [userData, voiceUnlocked]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black via-[#08001a] to-[#010003] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative pt-[30px]">
      <HiOutlineMenuAlt3
        className="text-white absolute top-[20px] right-[20px] w-[25px] cursor-pointer
        h-[25px] z-40"
        onClick={() => setHam(true)}
      />
 

      <div
        className={`fixed top-0 right-0 w-full md:w-[320px] h-full bg-[#000000a0] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start transition-transform duration-300 ease-in-out z-50
          ${ham ? "translate-x-0" : "translate-x-full"}`}
      >
        <GiCrossMark
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer"
          onClick={() => setHam(false)}
        />

        <h1 className="text-white font-bold text-[23px] mt-[60px]">History</h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col p-2 border-t border-b border-gray-600">
          {userData?.history?.map((his, index) => (
            <span key={index} className="text-white font-light text-[16px]">
              {his}
            </span>
          ))}

          {userData?.history?.length === 0 && (
            <span className="text-gray-400 font-light text-[16px] italic">
              No history available.
            </span>
          )}
        </div>

        <GradientButton
          size="sm" 
          className="mt-4" 
          onClick={() => {
            navigate("/customize");
            setHam(false);
          }}
        >
          Customize Assistant
        </GradientButton>

        <GradientButton
          size="sm" 
          shadowColor="red" 
          className="mt-2" 
          onClick={handleLogout}
        >
          Log Out
        </GradientButton>
      </div>

      {!voiceUnlocked && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-50">
          <h2 className="text-white text-[20px] font-semibold text-center cursor-pointer p-4">
            Click anywhere to activate voice assistant
          </h2>
        </div>
      )}

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-widest p-2">
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-500 text-transparent bg-clip-text drop-shadow-[0_0_18px_rgba(74,20,140,1)]">
          I am
        </span>

        <span className="text-white ml-3">
          {userData?.assistantName || "Loading..."}
        </span>
      </h1>
      {!aiText && <img src={user} alt="" className="w-[200px] rounded-full" />}
      {aiText && <img src={ai} alt="" className="w-[200px] rounded-full" />}
      <h1 className="text-white text-[20px] font-semibold text-wrap p-[20px] text-center">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
