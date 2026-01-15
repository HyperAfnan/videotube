import {
   MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RecommandedVideos = ({ recommendedVideos }) => (
   <div className="min-w-0">
      <Tabs defaultValue="all" className="w-full">
         <TabsList className="w-full mb-4 bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100">
               All
            </TabsTrigger>
            <TabsTrigger value="from-channel" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100">
               From Channel
            </TabsTrigger>
         </TabsList>

         <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
               <div className="space-y-3">
                  {recommendedVideos.map((video) => (
                     <Card
                        key={video.id}
                        className="overflow-hidden cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 bg-transparent"
                     >
                        <div className="flex gap-2 p-2">
                           <div className="relative w-40 shrink-0">
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                                 <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                 />
                                 <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                    {video.duration}
                                 </div>
                              </div>
                           </div>
                           <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold line-clamp-2 text-zinc-900 dark:text-zinc-100 mb-1">
                                 {video.title}
                              </h3>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-0.5">
                                 {video.channel}
                              </p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                 {video.views} • {video.timestamp}
                              </p>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0 text-zinc-900 dark:text-zinc-100"
                           >
                              <MoreHorizontal className="w-4 h-4" />
                           </Button>
                        </div>
                     </Card>
                  ))}
               </div>
            </ScrollArea>
         </TabsContent>

         <TabsContent value="from-channel" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
               <div className="space-y-3">
                  {recommendedVideos.slice(0, 5).map((video) => (
                     <Card
                        key={video.id}
                        className="overflow-hidden cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 bg-transparent"
                     >
                        <div className="flex gap-2 p-2">
                           <div className="relative w-40 shrink-0">
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                                 <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                 />
                                 <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                    {video.duration}
                                 </div>
                              </div>
                           </div>
                           <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold line-clamp-2 text-zinc-900 dark:text-zinc-100 mb-1">
                                 {video.title}
                              </h3>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-0.5">
                                 Channel Name
                              </p>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                 {video.views} • {video.timestamp}
                              </p>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0 text-zinc-900 dark:text-zinc-100"
                           >
                              <MoreHorizontal className="w-4 h-4" />
                           </Button>
                        </div>
                     </Card>
                  ))}
               </div>
            </ScrollArea>
         </TabsContent>
      </Tabs>
   </div>
)

export default RecommandedVideos;
