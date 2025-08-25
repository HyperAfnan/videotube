import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout, Protected } from "@Shared/components/";
import { Provider } from "react-redux";
import { store } from "@Store/index.js";
import { SkeletonTheme } from "react-loading-skeleton";
import Home from "@Features/home/pages/Home.jsx";
import AuthInitializer from "@Features/auth/components/AuthInit.jsx";
import Login from "@Features/auth/pages/Login.jsx";
import Signup from "@Features/auth/pages/Signup.jsx";
import WatchLaterPage from "@Features/watchlater/pages/WatchLaterPage.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            path: "/",
            element: (
               <Protected auth={false}>
                  <Home />
               </Protected>
            ),
            index: true,
         },
         {
            path: "/login",
            element: (
               <Protected auth={false}>
                  <Login />
               </Protected>
            ),
         },
         {
            path: "/signup",
            element: (
               <Protected auth={false}>
                  <Signup />
               </Protected>
            ),
         },
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
         {
            path: "/watchlater",
            element: (
               <Protected auth>
                  <WatchLaterPage />
               </Protected>
            ),
         },
      ],
   },
]);

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: 2,
         staleTime: 5 * 60 * 1000,
         cacheTime: 10 * 60 * 1000,
         refetchOnWindowFocus: true,
      },
      mutations: {
         retry: 1,
      },
   },
});

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <ReactQueryDevtools initialIsOpen={false} />
         <SkeletonTheme baseColor="#edebeb" highlightColor="#d4d2d2">
            <Provider store={store}>
               <AuthInitializer>
                  <RouterProvider router={router} />
               </AuthInitializer>
            </Provider>
         </SkeletonTheme>
      </QueryClientProvider>
   </StrictMode>,
);
