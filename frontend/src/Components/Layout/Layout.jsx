import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";

export default function Layout() {
   const location = useLocation();
   const hideHeader = location.pathname === "/login" || location.pathname === "/signup";
   return (
      <div>
         {!hideHeader && <Header />}
         <Outlet />
      </div>
   );
}
