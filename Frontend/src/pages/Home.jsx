import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const manualStopRef = useRef(false);

  const [voiceUnlocked, setVoiceUnlocked] = useState(false);
  const synth = window.speechSynthesis;

  // ✅ Text-to-Speech (default voice)
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
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  // 🔹 Unlock voice in Chrome
  useEffect(() => {
    const unlockAudio = () => {
      const test = new SpeechSynthesisUtterance("Voice enabled!");
      synth.speak(test);
      setVoiceUnlocked(true);
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
  }, [synth]);

  // ✅ Handle commands from Gemini
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    switch (type) {
      case "google_search":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;
      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        break;
      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        break;
      case "weather_show":
        window.open(`https://www.google.com/search?q=weather`, "_blank");
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
      case "get_time":
        const now = new Date();
        speak(`The time is ${now.getHours()}:${now.getMinutes()}`);
        break;
      default:
        break;
    }
  };

  // ✅ Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return console.error("Speech Recognition not supported");

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

      if (
        userData &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        manualStopRef.current = true;
        try {
          recognition.stop();
        } catch (err) {}
        isRecognizingRef.current = false;

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
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
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-[15px] relative">
      {!voiceUnlocked && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-50">
          <h2 className="text-white text-[20px] font-semibold text-center cursor-pointer">
            Click anywhere to activate voice assistant
          </h2>
        </div>
      )}

      <button
        className="min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black text-[19px] font-semibold absolute top-[20px] right-[20px] cursor-pointer"
        onClick={handleLogout}
      >
        Log Out
      </button>

      <button
        className="min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black text-[19px] font-semibold absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I am {userData?.assistantName}
      </h1>
    </div>
  );
};

export default Home;