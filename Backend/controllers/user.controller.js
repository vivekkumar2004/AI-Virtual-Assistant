import { response } from "express";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "get current user error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "updateAssistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    if (!result) {
      return res.status(500).json({ response: "No response from Gemini API." });
    }

    console.log("🧠 Raw Gemini Response:", result);

    // ✅ Extract JSON safely (if available)
    const jsonMatch = result.match(/{[\s\S]*}/);
    let gemResult;

    if (jsonMatch) {
      try {
        gemResult = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.error("⚠️ JSON parse error:", parseErr);
      }
    }

    // ✅ Fallback when Gemini sends plain text
    if (!gemResult) {
      gemResult = {
        type: "general",
        userInput: command,
        response: result.trim() || "I'm here, but I didn’t catch that clearly.",
      };
    }

    const type = gemResult.type?.toLowerCase().replace("-", "_");

    // ✅ Handle all supported commands
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `It's ${moment().format("MMMM")}`,
        });

      //  Handle general or undefined cases gracefully
      case "google_search":
      case "youtube_search":
      case "youtube_open":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "linkedin_open":
      case "x_open":
      case "amazon_open":
      case "amazon_search":
      case "flipkart_open":
      case "flipkart_search":
      case "netflix_open":
      case "netflix_search":
      case "spotify_open":
      case "spotify_search":
      case "weather_show":
      case "general":
      default:
        return res.json({
          type: type || "general",
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
    }
  } catch (error) {
    console.error(" Assistant error:", error);
    return res.status(500).json({
      response: "Internal error while processing your request.",
    });
  }
};
