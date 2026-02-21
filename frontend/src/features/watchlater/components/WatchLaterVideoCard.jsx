import { Link } from "react-router-dom";
import { BookmarkIcon, EllipsisVerticalIcon, Download, ListPlusIcon, Share2Icon, Trash, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLaterOperations } from "../hook/useWatchLaterMutation.js";
import { shareVideo, downloadVideo } from "@Shared/components/Menu/menuActions.js";
import { Badge } from "@/components/ui/badge";
import { 
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const WatchLaterVideoCard = ({ video }) => {
   const { removeFromWatchLater, isRemovingFromWatchLater } = useWatchLaterOperations();
   const thumbnail = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=240&fit=crop";

   // Format duration to MM:SS or HH:MM:SS
   const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
         return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
   };

   return (
      <div className="w-full flex flex-row items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors mb-2">
         {/* Left Section: Video thumbnail */}
         <Link to={`/watch/${video._id}`} className="shrink-0 relative group">
            <img
               src={thumbnail}
               alt={video.title}
               className="w-[246px] h-[138px] object-cover rounded-xl group-hover:opacity-90 transition-opacity"
            />
            {/* Duration badge */}
            <Badge className="absolute bottom-1.5 right-1.5 bg-black/90 text-white hover:bg-black/90 text-xs font-semibold px-1.5 py-0.5 h-auto">
               {formatDuration(video.duration || 795)}
            </Badge>
         </Link>
         
         {/* Middle Section: Video info */}
         <div className="flex-1 min-w-0 flex flex-col gap-1 pt-0.5">
            <Link to={`/watch/${video._id}`} className="block">
               <h3 className="text-sm font-semibold text-foreground hover:text-foreground/80 line-clamp-2 leading-tight mb-1">
                  {video.title}
               </h3>
            </Link>
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
               <Link to={`/channel/${video.owner._id}`} className="hover:text-foreground w-fit">
                  {video.owner.username}
               </Link>
               <div className="flex items-center gap-1">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{timeAgo(video.createdAt)}</span>
               </div>
            </div>
         </div>
         
         {/* Right Section: Action menu */}
         <div className="shrink-0 self-start">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                     <EllipsisVerticalIcon className="h-5 w-5" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuItem onClick={() => console.log("Add to Queue clicked")}>
                  <ListPlusIcon className="mr-2 h-4 w-4" />
                  Add to Queue
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => console.log("Add to playlist")}>
                  <BookmarkIcon className="mr-2 h-4 w-4" />
                  Add to Playlist
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => downloadVideo(video._id, video.title)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => shareVideo(video._id)}>
                  <Share2Icon className="mr-2 h-4 w-4" />
                  Share Video
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => console.log("Move To Top")}>
                  <ArrowBigUp className="mr-2 h-4 w-4" />
                  Move To Top
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => console.log("Move To Down")}>
                  <ArrowBigDown className="mr-2 h-4 w-4" />
                  Move To Bottom
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem 
                  onClick={async () => removeFromWatchLater(video._id)}
                  className="text-destructive focus:text-destructive"
                  disabled={isRemovingFromWatchLater}
               >
                  <Trash className="mr-2 h-4 w-4" />
                  {isRemovingFromWatchLater ? "Removing..." : "Remove from Watch Later"}
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
         </div>
      </div>
   );
};
export default WatchLaterVideoCard;
