import { Request, Response } from "express";
import Portfolio from "../models/Portfolio";

//Create new portfolio item
export const createPortfolioItem = async (req: Request, res: Response) => {
  try {
    const newItem = await Portfolio.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating portfolio item", error });
  }
};

//Get all portfolio items
export const getAllPortfolioItems = async (_req: Request, res: Response) => {
  try {
    const items = await Portfolio.find().sort({ displayOrder: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching portfolio items", error });
  }
};

//Get a portfolio item by ID
export const getPortfolioItemById = async (req: Request, res: Response) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

//Update a portfolio item
export const updatePortfolioItem = async (req: Request, res: Response) => {
  try {
    const updatedItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

//Delete a portfolio item
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const deletedItem = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};
