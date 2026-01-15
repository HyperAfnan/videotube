import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import queryClient from "./lib/queryCilent.js";
import { store } from "@Store/index.js";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout, Protected } from "@Shared/components/";
import { Provider } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import Home from "@Features/home/pages/Home.jsx";
import AuthInitializer from "@Features/auth/components/AuthInit.jsx";
import ThemeInitializer from "@Features/theme/components/ThemeInitializer.jsx";
import Login from "@Features/auth/pages/Login.jsx";
import Signup from "@Features/auth/pages/Signup.jsx";
import WatchLaterPage from "@Features/watchlater/pages/WatchLaterPage.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ConfirmEmail from "./features/auth/pages/ConfirmEmail.jsx";
import PlayingVideoPage from "./features/video/pages/playingVideo/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
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
      {
         path: "/confirm-email",
         element: (
            <Protected auth={false}>
               <ConfirmEmail />
            </Protected>
         ),
      },
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
      {
         path: "/watch/:videoId",
        element: (
          <PlayingVideoPage />
        )

        
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
         <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ThemeInitializer>
          <SkeletonTheme
            baseColor="var(--background)"
            highlightColor="var(--muted)"
            duration={1.5}
          >
            <AuthInitializer>
              <RouterProvider router={router} />
            </AuthInitializer>
          </SkeletonTheme>
        </ThemeInitializer>
      </Provider>
         </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
