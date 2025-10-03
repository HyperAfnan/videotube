import { Outlet, useLocation } from "react-router-dom";
// import { Header, /* ConfirmEmailFooter, */ SideBar } from "../index.js";
// import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import { Header, SideBar } from "./index.js";
import { useAuth } from "@Features/auth/hook/useAuth.js";

export default function Layout() {
   const location = useLocation();
   /* // const isEmailConfirmed = useSelector(
    //    (state) => state.auth?.userMeta?.isEmailConfirmed,
    // );
    // const isAuthenticated = useSelector((state) => state.auth?.status); */
   // const { isAuthenticated, user } = useAuth();
   // const isEmailConfirmed = user?.isEmailConfirmed;

   const hideBars =
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/confirm-email";
   return (
      <div>
         <Toaster
            richColors
            position="bottom-left"
            icons={false}
            toastOptions={
               {
                  // classNames: {
                  //    toast: "w-40 h-15 flex flex-row justify-center items-center bg-white text-gray-800 shadow-lg rounded-lg p-4",
                  //    title: "text-md ",
                  //    description: "description",
                  //    actionButton: "text-blue-500 hover:text-blue-700",
                  //    cancelButton: "cancel-button",
                  //    closeButton: "close-button",
                  // },
               }
            }
         />
         {!hideBars && <Header />}
         <div className="flex">
            {!hideBars && <SideBar />}
            <Outlet />
         </div>
         {/* {isAuthenticated && !isEmailConfirmed && <ConfirmEmailFooter />} */}
      </div>
   );
}
