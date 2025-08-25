import { toast } from "sonner";

export const notificationService = {
   success: (msg, props) => toast.success(msg, { props }),
   error: (msg, props) =>
      toast.error(msg, {
         unstyled: true,
         classNames: {
            toast:
               "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
            title: "text-md text-gray-800 font-normal text-center",
         },
         props,
      }),
   info: (msg, props) =>
      toast(msg, {
         unstyled: true,
         classNames: {
            toast:
               "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
            title: "text-md text-gray-800 font-normal text-center",
         },
         props,
      }),
   warning: (msg, props) => toast.warning(msg, { props }),
};
