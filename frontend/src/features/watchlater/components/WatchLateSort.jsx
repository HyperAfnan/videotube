import { ArrowDown01 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const sortOptions = [
   {
      label: "Date Published (newest)",
      filter: (a, b) => new Date(b.video.createdAt) - new Date(a.video.createdAt),
      value: "dataPublishedNewest",
   },
   {
      label: "Date Published (oldest)",
      filter: (a, b) => new Date(a.video.createdAt) - new Date(b.video.createdAt),
      value: "datePublishedOldest",
   },
   {
      label: "Most Popular",
      filter: (a, b) => b.video.views - a.video.views,
      value: "mostPopular",
   },
   {
      label: "Date Added (newest)",
      filter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      value: "dateAddedNewest",
   },
   {
      label: "Date Added (oldest)",
      filter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      value: "dateAddedOldest",
   },
];

const WatchListSort = ({ setSortOption }) => {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
               <ArrowDown01 className="w-4 h-4" />
               <span>Sort</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start" className="w-56">
            {sortOptions.map((option) => (
               <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortOption(option)}
               >
                  {option.label}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default WatchListSort;
