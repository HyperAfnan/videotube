import { TextInput } from "./Input.jsx";
import { useFormContext } from "react-hook-form";

const UploadDetails = () => {
   const { register } = useFormContext();
   return (
      <>
         <h1 className="text-2xl font-medium text-left">Details</h1>

         <div className="flex flex-col space-y-4">
            <TextInput
               type="text"
               name="Title (required)"
               placeholder="Add a title that describes your video"
               tooltip="A catchy title can help you to hook viewers..."
               width="w-[500px]"
               height="h-[80px]"
               {...register("title", { required: "Title is required" })}
            />
            <TextInput
               type="text"
               name="Description (required)"
               placeholder="Tell viewers what your video is about"
               tooltip="Writing descriptions with keywords..."
               width="w-[500px]"
               height="h-[150px]"
               {...register("description", { required: "Description is required" })}
            />
         </div>
      </>
   );
};

export default UploadDetails;
