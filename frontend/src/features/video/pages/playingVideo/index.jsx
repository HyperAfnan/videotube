import { useState } from "react";
import {
   ThumbsUp,
   ThumbsDown,
   Share2,
   Download,
   MoreHorizontal,
   Bell,
   ChevronDown,
   ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import Container from "@/shared/components/DarkModeContainer";
import { useParams } from "react-router-dom"
import { useVideoById, useVideoComments } from "../../hook/useVideoQueries.js";
import { useAuth } from "@/features/auth/hook/useAuth.js";
import { useAddComment, useLikeComment, useToggleVideoLike, useToggleSubscription } from "../../hook/useVideoMutations.js";
import VideoComments from "../../components/PlayingVideo/CommentsSection.jsx";
import RecommandedVideos from "../../components/PlayingVideo/RecommandedVideos.jsx";

const PlayingVideoPage = () => {
   const { videoId } = useParams();
   const { user } = useAuth();
   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
   const { data: videoData, isLoading, isError } = useVideoById(videoId);
   const { data: commentsData, isLoading: videoCommentsLoading, isError: videoCommentsError } = useVideoComments(videoId);
   // const { addCommet } = useVideoCommentsOperations();
   const { mutate: addComment } = useAddComment(videoId);
   const { mutate: likeComment } = useLikeComment(videoId);
   const { mutate: toggleVideoLike } = useToggleVideoLike(videoId);
   const { mutate: toggleSubscription } = useToggleSubscription(videoId);

   console.log(commentsData);

   const isOwnVideo = user?._id === videoData?.owner?._id;

   const handleSubscribe = () => {
      if (isOwnVideo) return; // Prevent subscribing to own channel
      
      const channelId = videoData?.owner?._id;
      if (channelId) {
         toggleSubscription(channelId);
      }
   };

   const handleVideoLike = () => {
      toggleVideoLike({ type: 'like' });
   };

   const handleVideoDislike = () => {
      toggleVideoLike({ type: 'dislike' });
   };

   const onLike = (commentId) => {
      likeComment(commentId);
   }

   const onSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const content = formData.get("comment");
      
      if (!content?.trim()) return;

      addComment({
         videoId,
         content: content,
         userId: user._id,
      });
      
      // Reset the form
      e.target.reset();
   }

   const recommendedVideos = Array(12).fill(null).map((_, i) => ({
      id: i,
      thumbnail: "https://via.placeholder.com/168x94/3f3f46/ffffff?text=Video",
      title: "Recommended Video Title That Might Be Long And Wrap",
      channel: "Channel Name",
      views: "1.2M views",
      timestamp: "2 days ago",
      duration: "10:23",
   }));

   return (
      <Container>
         <div className="w-full max-w-450 mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
               {/* Main Video Section */}
               <div className="space-y-4 min-w-0">
                  {/* Video Player */}
                  <Card className="overflow-hidden bg-black dark:bg-black border-0 shadow-lg">
                     <div className="relative aspect-video bg-black">
                        <img
                           src={videoData?.thumbnail}
                           alt="Video thumbnail"
                           className="w-full h-full object-cover"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                           <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors">
                              <div className="w-0 h-0 border-t-15 border-t-transparent border-l-25 border-l-white border-b-15 border-b-transparent ml-1"></div>
                           </div>
                        </div>
                     </div>
                  </Card>

                  {/* Video Title */}
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">
                     {videoData?.title}
                  </h1>

                  {/* Video Info Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                     <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-zinc-300 font-medium">
                           {videoData?.views} views
                        </span>
                        <span className="text-sm text-gray-600 dark:text-zinc-400">
                           • {new Date(videoData?.createdAt).toLocaleDateString()}
                        </span>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                           <Button
                              variant="accent"
                              size="sm"
                              className={`rounded-l-full rounded-r-none hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100 
                                 ${videoData?.userInteration?.isLiked ? "text-blue-600 dark:text-blue-400" : ""}`}
                              onClick={handleVideoLike}
                           >
                              <ThumbsUp className="w-5 h-5 mr-2" />
                              <span className="font-semibold">{videoData?.likes}</span>
                           </Button>
                           <Separator orientation="vertical" className="h-6 bg-zinc-300 dark:bg-zinc-600" />
                           <Button
                              variant="ghost"
                              size="sm"
                              className={
                                 `rounded-r-full rounded-l-none hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100
                                 ${videoData?.userInteration?.isDisliked ? "text-blue-600 dark:text-blue-400" : ""}`
                              }
                              onClick={handleVideoDislike}
                           >
                              <ThumbsDown className="w-5 h-5" />
                           </Button>
                        </div>

                        <Button
                           variant="secondary"
                           size="sm"
                           className="rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100"
                        >
                           <Share2 className="w-5 h-5 mr-2" />
                           Share
                        </Button>

                        <Button
                           variant="secondary"
                           size="sm"
                           className="rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100"
                        >
                           <Download className="w-5 h-5 mr-2" />
                           Download
                        </Button>

                        <Button
                           variant="secondary"
                           size="sm"
                           className="rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100"
                        >
                           <MoreHorizontal className="w-5 h-5" />
                        </Button>
                     </div>
                  </div>

                  {/* Channel Info */}
                  <Card className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                     <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                           <div className="flex items-start gap-4 flex-1">
                              <Avatar className="w-10 h-10 rounded-full">
                                 <div className="w-full h-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                    {videoData?.owner?.username?.slice(0, 2)?.toUpperCase()}
                                 </div>
                              </Avatar>
                              <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
                                       {videoData?.owner?.username}
                                    </h3>
                                    <svg
                                       className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                    >
                                       <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                    </svg>
                                 </div>
                                 <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {videoData?.owner?.subscribers} subscribers
                                 </p>
                              </div>
                           </div>

                           <div className="flex items-center gap-2">
                              <Button
                                 variant={videoData?.owner?.isSubscribed || videoData?.userInteration?.isSubscribed ? "secondary" : "default"}
                                 size="sm"
                                 disabled={isOwnVideo}
                                 className={`rounded-full font-semibold
                                    ${videoData?.owner?.isSubscribed || videoData?.userInteration?.isSubscribed
                                       ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                                       : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"}
                                    ${isOwnVideo ? "opacity-50 cursor-not-allowed" : ""}`}
                                 onClick={handleSubscribe}
                              >
                                 {videoData?.owner?.isSubscribed || videoData?.userInteration?.isSubscribed ? (
                                    <>
                                       <Bell className="w-4 h-4 mr-2 fill-current" />
                                       Subscribed
                                    </>
                                 ) : (
                                    "Subscribe"
                                 )}
                              </Button>
                           </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                           <div
                              className="text-sm text-zinc-700 dark:text-zinc-300" >
                              <p>
                                 {videoData?.description.slice(0, 200)}
                              </p>
                              {isDescriptionExpanded && (
                                 <p className="">
                                    {videoData?.description.slice(200) ? videoData?.description.slice(200) : ""}
                                 </p>
                              )}
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 px-0 h-auto font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-transparent"
                              onClick={() =>
                                 setIsDescriptionExpanded(!isDescriptionExpanded)
                              }
                           >
                              {isDescriptionExpanded ? (
                                 <>
                                    Show less <ChevronUp className="w-4 h-4 ml-1" />
                                 </>
                              ) : (
                                 <>
                                    Show more <ChevronDown className="w-4 h-4 ml-1" />
                                 </>
                              )}
                           </Button>
                        </div>
                     </CardContent>
                  </Card>

                  
                  <VideoComments
                     commentsData={commentsData}
                     isLoading={videoCommentsLoading}
                     isError={videoCommentsError}
                     onSubmit={onSubmit}
                     onLike={onLike}
                     user={user}
                  />
               </div>

               <RecommandedVideos recommendedVideos={recommendedVideos} />
               
            </div>
         </div>
      </Container>
   );
};

export default PlayingVideoPage;

