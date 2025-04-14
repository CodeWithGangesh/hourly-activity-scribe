
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { Activity } from "@/types/activity";
import { addActivity, getActivities, clearActivities } from "@/utils/storage";
import { useHourlyAlert } from "@/hooks/useHourlyAlert";
import Clock from "@/components/Clock";
import NotificationModal from "@/components/NotificationModal";
import ActivityForm from "@/components/ActivityForm";
import ActivityList from "@/components/ActivityList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart } from "lucide-react";
import MainNav from "@/components/MainNav";

const Index = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(() => getActivities());

  // Handle hour change by showing notification
  const handleHourChange = useCallback(() => {
    setShowNotification(true);
    toast("Time to log your activity!", {
      description: "A new hour has begun!",
      duration: 5000,
    });
  }, []);

  const { formatTime, hourProgress, playRingtone } = useHourlyAlert({
    onHourChange: handleHourChange,
  });

  // Handle activity submission
  const handleActivitySubmit = (activity: Activity) => {
    const updatedActivities = addActivity(activity);
    setActivities(updatedActivities);
    setShowNotification(false);
  };

  // Handle clear all activities
  const handleClearActivities = () => {
    clearActivities();
    setActivities([]);
    toast("All activities cleared", {
      description: "Your activity history has been cleared.",
    });
  };

  // Calculate summary stats
  const getTotalActivities = () => activities.length;
  
  const getActivityCountByCategory = () => {
    return activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const categoryStats = getActivityCountByCategory();

  return (
    <div className="container py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <MainNav />
      </div>
      
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hourly Activity Logger</h1>
        <p className="text-muted-foreground mt-2">
          Track and log your activities throughout the day
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        {/* Clock section */}
        <Card className="sm:col-span-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="py-6">
            <Clock time={formatTime()} progress={hourProgress()} />
          </CardContent>
        </Card>

        {/* Main content - tabs */}
        <div className="sm:col-span-6">
          <Tabs defaultValue="log" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="log" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Log Activity
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Activity History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="log" className="mt-0">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <ActivityForm onSubmit={handleActivitySubmit} />
                </div>
                <div className="lg:col-span-5">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Activity Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <p className="text-sm text-muted-foreground">Total Activities Logged</p>
                          <p className="text-2xl font-bold mt-1">{getTotalActivities()}</p>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <p className="text-sm text-muted-foreground mb-3">Activities by Category</p>
                          
                          <div className="space-y-2">
                            {Object.keys(categoryStats).length > 0 ? (
                              Object.entries(categoryStats).map(([category, count]) => (
                                <div key={category} className="flex justify-between items-center">
                                  <span className="text-sm capitalize">{category}</span>
                                  <span className="text-sm font-medium">{count}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No activities logged yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <ActivityList activities={activities} onClear={handleClearActivities} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <NotificationModal 
        isOpen={showNotification} 
        onClose={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default Index;
