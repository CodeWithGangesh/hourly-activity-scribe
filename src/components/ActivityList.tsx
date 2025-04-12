
import React from "react";
import { format } from "date-fns";
import { Activity } from "@/types/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, GraduationCap, Coffee, BookText, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ActivityListProps {
  activities: Activity[];
  onClear: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onClear }) => {
  const getCategoryIcon = (category: Activity["category"]) => {
    switch (category) {
      case "work":
        return <Briefcase className="h-4 w-4" />;
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "learning":
        return <GraduationCap className="h-4 w-4" />;
      case "break":
        return <Coffee className="h-4 w-4" />;
      case "personal":
        return <BookText className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Activity["category"]) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-700";
      case "meeting":
        return "bg-purple-100 text-purple-700";
      case "learning":
        return "bg-green-100 text-green-700";
      case "break":
        return "bg-orange-100 text-orange-700";
      case "personal":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatActivityDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a - MMM d");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Activity History</CardTitle>
        {activities.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-8 text-xs"
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities logged yet</p>
            <p className="text-sm mt-1">Your logged activities will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {format(new Date(date), "EEEE, MMMM d")}
                  </h3>
                  <div className="space-y-2">
                    {groupedActivities[date].map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 rounded-md border animate-slide-in"
                      >
                        <div className={`p-2 rounded-md ${getCategoryColor(activity.category)}`}>
                          {getCategoryIcon(activity.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium whitespace-normal break-words">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatActivityDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;
