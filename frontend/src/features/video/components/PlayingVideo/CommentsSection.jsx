import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input.jsx";

const VideoComments = ({
   commentsData,
   user,
   onSubmit,
   onLike
}) => {
   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
               {commentsData?.totalComments ?? 0} Comments
            </h2>
         </div>

         <div className="flex gap-4">
            <Avatar className="w-10 h-10 rounded-full shrink-0">
               <div className="w-full h-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {user?.username?.slice(0, 2)?.toUpperCase()}
               </div>
            </Avatar>

            <div className="flex-1">
               <form onSubmit={onSubmit}>
                  <Input
                     name="comment"
                     placeholder="Add a comment..."
                     className="min-h-15 resize-none bg-transparent border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-300 px-0 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                     <Button variant="ghost" size="sm">
                        Cancel
                     </Button>
                     <Button size="sm" type="submit">
                        Comment
                     </Button>
                  </div>
               </form>
            </div>
         </div>

         <Separator className="my-4" />

         <div className="space-y-6">
            {
               commentsData?.comments?.length === 0 ? (
               <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No comments yet. Be the first to comment!
               </p>
            ) :
               commentsData?.comments?.map((comment) => (
                  <div key={comment._id} className="flex gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors">
                     <Avatar className="w-10 h-10 rounded-full shrink-0 border border-zinc-300 dark:border-zinc-600">
                        <img src={comment.user.avatar} alt={comment.user.username.slice(0, 2).toUpperCase()} />
                     </Avatar>

                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                              {comment.user.username}
                           </span>
                           <span className="text-xs text-zinc-600 dark:text-zinc-400">
                              {comment.createdAt} ago
                           </span>
                        </div>

                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                           {comment.content}
                        </p>

                        <div className="flex items-center gap-4">
                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto px-0 hover:bg-transparent"
                              onClick={() => onLike(comment._id)}
                           >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span className="text-xs">{comment.likes}</span>
                           </Button>

                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto px-0 hover:bg-transparent"
                           >
                              <ThumbsDown className="w-4 h-4" />
                           </Button>
                        </div>
                     </div>
                  </div>
               ))}
         </div>
      </div>
   );
};

export default VideoComments;
