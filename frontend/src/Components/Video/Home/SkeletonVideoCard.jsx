import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonVideoCard = ({ count }) => {
   return Array(count)
      .fill()
      .map((_, index) => (
         <div
            key={index}
            className="flex flex-col space-y-4 w-[435px] h-[350px] mx-2 my-2 rounded-xl p-2"
         >
            <Skeleton height={245} className="w-full rounded-xl" />
            <div className="flex flex-row space-x-2">
               <div className="flex-shrink-0">
                  <Skeleton circle width={40} height={40} />
               </div>
               <div className="flex flex-col w-full space-y-1">
                  <Skeleton height={20} width="80%" />
                  <Skeleton height={16} width="60%" />
                  <Skeleton height={14} width="50%" />
               </div>
            </div>
         </div>
      ));
};

export default SkeletonVideoCard;
