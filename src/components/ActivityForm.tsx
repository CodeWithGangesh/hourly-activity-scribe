
import React, { useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Activity, ActivityCategory } from "@/types/activity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookText, Briefcase, Coffee, GraduationCap, Users, Sparkles } from "lucide-react";

interface ActivityFormProps {
  onSubmit: (activity: Activity) => void;
}

const CATEGORIES: { value: ActivityCategory; label: string; icon: React.ReactNode }[] = [
  { value: "work", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
  { value: "meeting", label: "Meeting", icon: <Users className="h-4 w-4" /> },
  { value: "learning", label: "Learning", icon: <GraduationCap className="h-4 w-4" /> },
  { value: "break", label: "Break", icon: <Coffee className="h-4 w-4" /> },
  { value: "personal", label: "Personal", icon: <BookText className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <Sparkles className="h-4 w-4" /> },
];

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("work");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error("Please enter a description of your activity");
      return;
    }

    const newActivity: Activity = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      description: description.trim(),
      category,
    };

    onSubmit(newActivity);
    toast.success("Activity logged successfully!");
    
    // Reset form
    setDescription("");
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Log Your Activity</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ActivityCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              What have you been doing?
            </label>
            <Textarea
              id="description"
              placeholder="Describe your activity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            Save Activity
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ActivityForm;
