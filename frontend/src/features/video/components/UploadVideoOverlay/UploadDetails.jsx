import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleHelp } from "lucide-react";

const UploadDetails = () => {
   const { register, formState: { errors } } = useFormContext();
   
   return (
      <>
         <h1 className="text-2xl font-medium text-left text-foreground">Details</h1>

         <div className="flex flex-col space-y-4">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <Label htmlFor="title">Title (required)</Label>
                  <CircleHelp className="h-4 w-4 text-muted-foreground" />
               </div>
               <Input
                  id="title"
                  placeholder="Add a title that describes your video"
                  className="w-full"
                  {...register("title", { required: "Title is required" })}
               />
               {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
               )}
            </div>

            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <Label htmlFor="description">Description (required)</Label>
                  <CircleHelp className="h-4 w-4 text-muted-foreground" />
               </div>
               <Textarea
                  id="description"
                  placeholder="Tell viewers what your video is about"
                  className="w-full min-h-[150px]"
                  {...register("description", { required: "Description is required" })}
               />
               {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
               )}
            </div>
         </div>
      </>
   );
};

export default UploadDetails;
