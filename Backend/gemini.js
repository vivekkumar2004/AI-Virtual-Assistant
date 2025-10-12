import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
    You are not Google. You will now behave like a voice-enabled assistance.
    
    Your task is to understand the user's natural language input and respond with a JSON 
    object like this:
    
    {
    "type":"general" | ""google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" |
    "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather-show",
    "userInput":"<original user input>" {only remove your name from userinput if exists} and agar
    kisi ne google ya youtube pe kuch searcg karne ko bola hai toh userInput me only wo search bala text jaye,
    "response":"<a short spoken response to read out loud to the user>" 
    }
    
    Instruction:
    - "type": determine the intent of the user.
    - "userinput: original sentence the user spoke.
    - "response" A short voice-friendly reply, e.g., "Sure, playing it now","Here's
    what i found", "Today is Tuesday", etc.

    Type meanings:
    - "general" : if it's a factual or informational question.
    - "google_search" : if user wants to search something on Google.
    - "youtube_search" : if user wants to search something on Youtube.
    - "youtube_play" : if user wants to directly play a video or song.
    - "calculator_open": : if user wants to open a calculator.
    - "instagram_open" : if user wants to open instagram.
    - "facebook_open" : if user wants to open facebook.
    - "weather_show" : if user wants to know weather.
    - "get_time" : if user asks for the current time.
    - "get_date" : if user asks for today's date.
    - "get_day" : if user asks what day it is.
    - "get_month" : if user asks for the current month.


    Important:
    - Use ${userName} agar koi puche tume kisne bnaya
    - Only respond with the JSON object, nohting else.
    
    
    now your userinput- ${command} 

    `;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });
    console.log("Gemini API raw result:", result.data);
    return result.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.log(error);
  }
};

export default geminiResponse;
