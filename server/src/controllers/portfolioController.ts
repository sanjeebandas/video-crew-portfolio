import { Request, Response } from "express";
import Portfolio from "../models/Portfolio";
import { createPortfolioNotification } from "./notification.controller";

//Create new portfolio item
export const createPortfolioItem = async (req: Request, res: Response) => {
  try {
    const newItem = await Portfolio.create(req.body);
    
    // Create notification for new portfolio item
    await createPortfolioNotification("created", newItem);
    
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

    // Create notification for updated portfolio item
    await createPortfolioNotification("updated", updatedItem);

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

    // Create notification for deleted portfolio item
    await createPortfolioNotification("deleted", deletedItem);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

// Get portfolio items by category
export const getPortfolioItemsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const koreanCategory = req.query.name as string;

    if (!koreanCategory) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Mapping Korean names to English slugs (as stored in DB)
    const categoryMap: Record<string, string> = {
      "광고 · 홍보 영상": "advertisement/promotional",
      "이러닝 영상": "e-learning",
      "기업 행사 영상": "corporate-event",
    };

    const englishCategory = categoryMap[koreanCategory];

    if (!englishCategory) {
      return res.status(404).json({ message: "Invalid category name" });
    }

    const items = await Portfolio.find({ category: englishCategory }).sort({
      displayOrder: 1,
    });

    res.status(200).json({ data: items });
  } catch (error) {
    console.error("Error fetching portfolio items by category:", error);
    res
      .status(500)
      .json({ message: "Error fetching portfolio items by category", error });
  }
};
