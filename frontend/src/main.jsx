import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider , createBrowserRouter } from "react-router-dom"
import { Layout } from "./Components/index.js"
import { Home, Login } from "./Page/index.js"
import Signup from "./Page/Signup.jsx"

const router = createBrowserRouter([
   {
      path : "/",
      element: <Layout />,
      children: [
         {
            path: "/",
            element: <Home />,
            index: true
         },
         {
            path: "/login",
            element: <Login />
         },
         {
            path: "/signup",
            element: <Signup />
         }
      ]
   }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
