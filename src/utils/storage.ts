
import { Activity } from "@/types/activity";

const STORAGE_KEY = "hourly-activities";

export const saveActivities = (activities: Activity[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
};

export const getActivities = (): Activity[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing activities from localStorage:", error);
    return [];
  }
};

export const addActivity = (activity: Activity): Activity[] => {
  const activities = getActivities();
  const updatedActivities = [activity, ...activities];
  saveActivities(updatedActivities);
  return updatedActivities;
};

export const clearActivities = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
