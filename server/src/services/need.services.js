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

export const updateNeedById = async (id, updateData) => {
  try {
    const updatedNeed = await Need.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedNeed) {
      return { status: "NOT_FOUND", message: "Need not found." };
    }
    return { status: "SUCCESS", data: updatedNeed };
  } catch (error) {
    console.error(" Need Service | updateNeedById:", error);
    return { status: "SERVER_ERROR", message: "Failed to update need." };
  }
};

export const deleteNeedById = async (id) => {
  try {
    const deletedNeed = await Need.findByIdAndDelete(id);
    if (!deletedNeed) {
      return { status: "NOT_FOUND", message: "Need not found." };
    }
    return { status: "SUCCESS", data: deletedNeed };
  } catch (error) {
    console.error(" Need Service | deleteNeedById:", error);
    return { status: "SERVER_ERROR", message: "Failed to delete need." };
  }
};

export const getNeedByBranchId = async (BranchId) => {
  try {
    const need = await Need.find({ branch: BranchId });
    if (!need) {
      return { status: "NOT_FOUND", message: "Need not found." };
    }
    return { status: "SUCCESS", data: need };
  } catch (error) {
    console.error(" Need Service | getNeedByBranchId:", error);
    return { status: "SERVER_ERROR", message: "Failed to retrieve need." };
  }
};
