import { Outlet, useLocation } from "react-router-dom";
import { Header, ConfirmEmailFooter, SideBar } from "../index.js";
import { useSelector } from "react-redux";

export default function Layout() {
   const location = useLocation();
   const isEmailConfirmed = useSelector(
      (state) => state.auth?.userMeta?.isEmailConfirmed,
   );
   const isAuthenticated = useSelector((state) => state.auth?.status);
   const hideBars =
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/confirm-email";
   return (
      <div>
         {!hideBars && <Header />}
         <div className="flex">
            {!hideBars && <SideBar />}
            <Outlet />
         </div>
         {/* {isAuthenticated && !isEmailConfirmed && <ConfirmEmailFooter />} */}
      </div>
   );
}
