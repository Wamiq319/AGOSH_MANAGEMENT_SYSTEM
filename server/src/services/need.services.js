import { Need } from "../models/index.js";

export const createNeed = async (NeedData) => {
  try {
    const newNeed = new Need(NeedData);
    const savedNeed = await newNeed.save();
    return { status: "SUCCESS", data: savedNeed };
  } catch (error) {
    console.error(" Need Service | createNeed:", error);
    return { status: "SERVER_ERROR", message: "Failed to create need." };
  }
};

export const getAllNeeds = async () => {
  try {
    const needs = await Need.find();
    return { status: "SUCCESS", data: needs };
  } catch (error) {
    console.error(" Need Service | getAllNeeds:", error);
    return { status: "SERVER_ERROR", message: "Failed to retrieve needs." };
  }
};
