import { timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLater } from "../hook/useWatchLaterQueries.js";
import { useAuth } from "@Features/auth/hook/useAuth.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Shuffle } from "lucide-react";

export const WatchLaterPreviewButton = ({ onClick, children, icon: Icon }) => (
   <Button
      onClick={onClick}
      variant="secondary"
      size="sm"
      className="flex-1"
   >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
   </Button>
);

export default function WatchLaterLeftSideComponent() {
   const { userMeta: { fullname } = {} } = useAuth();
   const { watchLater, isFetching } = useWatchLater();

   const lastUpdated = timeAgo(watchLater[watchLater.length - 1]?.createdAt);

   const totalDuration = watchLater.reduce((acc, video) => {
      if (!video.video || !video.video.duration) return acc;
      return acc + video.video.duration;
   }, 0);

   return (
      <Card className="fixed top-20 left-20 w-[360px] rounded-2xl z-20 border-border bg-card">
         <CardContent className="p-4">
            {isFetching && (
               <Badge variant="secondary" className="absolute top-2 right-2 animate-pulse">
                  Updating
               </Badge>
            )}

            {/* watch later preview thumbnail */}
            <div className="w-full rounded-2xl flex justify-center items-center mb-4">
               <img
                  src={thumbnail}
                  alt="Watch Later Thumbnail"
                  className="h-[165px] object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
               />
            </div>

            <div className="space-y-2">
               <h2 className="text-lg font-semibold text-foreground">
                  Watch Later
               </h2>

               <p className="text-base font-medium text-muted-foreground">
                  {fullname?.toUpperCase()}
               </p>

               <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <Badge variant="outline">
                     {watchLater.length} videos
                  </Badge>
                  <Badge variant="outline">
                     {totalDuration} min
                  </Badge>
                  <Badge variant="outline">
                     {lastUpdated}
                  </Badge>
               </div>

               <div className="flex gap-2 pt-4">
                  <WatchLaterPreviewButton 
                     onClick={() => console.log("Play All")}
                     icon={Play}
                  >
                     Play All
                  </WatchLaterPreviewButton>
                  <WatchLaterPreviewButton 
                     onClick={() => console.log("Shuffle")}
                     icon={Shuffle}
                  >
                     Shuffle
                  </WatchLaterPreviewButton>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
