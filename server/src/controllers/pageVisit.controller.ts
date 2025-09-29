import { Request, Response } from "express";
import PageVisit from "../models/PageVisit";
import { checkPageVisitMilestones } from "./notification.controller";

// Increment page visit count
export const incrementPageVisit = async (req: Request, res: Response) => {
  try {
    // Find the single page visit document or create one if it doesn't exist
    let pageVisit = await PageVisit.findOne();
    
    if (!pageVisit) {
      // Create new document if none exists
      pageVisit = new PageVisit({
        totalVisits: 1,
        lastUpdated: new Date()
      });
    } else {
      // Increment existing count
      pageVisit.totalVisits += 1;
      pageVisit.lastUpdated = new Date();
    }
    
    await pageVisit.save();
    
    // Check for page visit milestones and create notifications
    await checkPageVisitMilestones();
    
    res.status(200).json({
      success: true,
      totalVisits: pageVisit.totalVisits,
      message: "Page visit recorded successfully"
    });
  } catch (error) {
    console.error('Error incrementing page visit:', error);
    res.status(500).json({
      success: false,
      message: "Failed to record page visit"
    });
  }
};

// Get current page visit count (for admin analytics)
export const getPageVisits = async (req: Request, res: Response) => {
  try {
    const pageVisit = await PageVisit.findOne();
    
    if (!pageVisit) {
      return res.status(200).json({
        success: true,
        totalVisits: 0,
        lastUpdated: null
      });
    }
    
    // Check for milestones when getting page visits (for initialization)
    await checkPageVisitMilestones();
    
    res.status(200).json({
      success: true,
      totalVisits: pageVisit.totalVisits,
      lastUpdated: pageVisit.lastUpdated
    });
  } catch (error) {
    console.error('Error getting page visits:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get page visits"
    });
  }
};

// Reset page visit count (for admin use)
export const resetPageVisits = async (req: Request, res: Response) => {
  try {
    let pageVisit = await PageVisit.findOne();
    
    if (!pageVisit) {
      pageVisit = new PageVisit({
        totalVisits: 0,
        lastUpdated: new Date()
      });
    } else {
      pageVisit.totalVisits = 0;
      pageVisit.lastUpdated = new Date();
    }
    
    await pageVisit.save();
    
    res.status(200).json({
      success: true,
      totalVisits: 0,
      message: "Page visits reset successfully"
    });
  } catch (error) {
    console.error('Error resetting page visits:', error);
    res.status(500).json({
      success: false,
      message: "Failed to reset page visits"
    });
  }
};
