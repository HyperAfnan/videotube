import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout, Protected } from "@Shared/components/";
import { Provider } from "react-redux";
import { store } from "@Store/index.js";
// import { SkeletonTheme } from "react-loading-skeleton";
// import AuthInitializer from "@Features/auth/components/AuthInit.jsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            path: "/",
            element: <Home />,
            index: true,
         },
         // {
         //    path: "/login",
         //    element: (
         //       <Protected auth={false}>
         //          <Login />
         //       </Protected>
         //    ),
         // },
         // {
         //    path: "/signup",
         //    element: (
         //       <Protected auth={false}>
         //          <Signup />
         //       </Protected>
         //    ),
         // },
         // {
         //    path: "/confirm-email",
         //    element: (
         //       <Protected auth={false}>
         //          <ConfirmEmail />
         //       </Protected>
         //    ),
         // },
         // {
         //    path: "/dashboard",
         //    element: (
         //       <Protected auth>
         //          <Dashboard />
         //       </Protected>
         //    ),
         // },
         // {
         //    path: "/watchlater",
         //    element: (
         //       <Protected auth>
         //          <WatchLaterPage />
         //       </Protected>
         //    ),
         // },
      ],
   },
]);

createRoot(document.getElementById("root")).render(
   <StrictMode>
         <SkeletonTheme baseColor="#edebeb" highlightColor="#d4d2d2">
            <Provider store={store}>
               <AuthInitializer>
                  <RouterProvider router={router} />
               </AuthInitializer>
            </Provider>
         </SkeletonTheme>
   </StrictMode>,
);
