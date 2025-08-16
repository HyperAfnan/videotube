import { ArrowDown01 } from "lucide-react";
import { useFloatingMenu } from "@Hooks/useFloatingMenu.js";

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
   const {
      isOpen ,
      setIsOpen,
      refs, 
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
   } = useFloatingMenu();
   return (
      <>
         <button
            className="w-20 h-full flex justify-start items-center hover:bg-gray-200 rounded-lg cursor-pointer transition-colors duration-300 p-2"
            ref={refs.setReference}
            {...getReferenceProps()}
         >
            <ArrowDown01 className="w-4 h-4 text-gray-600 mr-2" />
            <span>Sort</span>
         </button>
         {isOpen ? (
            <div
               className="bg-white text-base font-normal shadow-lg rounded-lg w-56 h-auto mt-2"
               ref={refs.setFloating}
               style={{ ...floatingStyles }}
               {...getFloatingProps()}
            >
               {sortOptions.map((option) => (
                  <button
                     key={option.value}
                     className="cursor-pointer hover:bg-gray-100 p-4 w-full text-left"
                     onClick={() => {
                        setSortOption(option);
                        setIsOpen((prev) => !prev);
                     }}
                  >
                     {option.label}
                  </button>
               ))}
            </div>
         ) : null}
      </>
   );
};

export default WatchListSort;
