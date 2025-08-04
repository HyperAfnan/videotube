import { EllipsisVertical } from "lucide-react";
import { useState, useRef } from "react";

const UploadFooter = () => {
   const buttonTexts = ["Publish Now", "Public Later"];
   const [buttonText, setButtonText] = useState(buttonTexts[0]);
   const spanRef = useRef(null);
   const toggleMenu = () => {
      if (spanRef.current.classList.contains("hidden")) {
         spanRef.current.classList.remove("hidden");
      } else {
         spanRef.current.classList.add("hidden");
      }
   };

   function closeMenu() {
         spanRef.current.classList.add("hidden");
   }

   function SelectionElement({ text, className, ...props }) {
      return (
         <span
            className={ `rounded-l-xl bg-black hover:bg-gray-500 py-2 px-3 text-white flex justify-center items-center ${className}` }
            ref={spanRef}
            onClick={() => {
               closeMenu();
               setButtonText(text);
            }}
            {...props}
         >
            {text}
         </span>
      );
   }

   return (
      <div className="flex items-center justify-end border-t-2  border-gray-200 ">
         <div className="flex items-center text-white px-4 py-2 rounded-xl space-x-0.5">
            <button
               type="button"
               className="rounded-l-xl flex flex-col"
            >
               <SelectionElement text={buttonText} className="w-full"/>
               <SelectionElement text={buttonTexts.find((text) => text !== buttonText)} className="hidden absolute bottom-10.5 h-[40px] w-[118px] right-auto  "/>
            </button>
            <div className="bg-black py-2 px-0.5 rounded-r-xl text-white ">
               <EllipsisVertical className="" onClick={toggleMenu} />
            </div>
         </div>
      </div>
   );
};

export default UploadFooter;
