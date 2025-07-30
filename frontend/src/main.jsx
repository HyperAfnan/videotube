import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider , createBrowserRouter } from "react-router-dom"
import { Layout } from "./Components/index.js"
import { Home, Login, Signup, ConfirmEmail } from "./Page/index.js"
import { Provider } from "react-redux"
import { store } from "./Store/store.js"

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
         },{
            path: "/confirm-email",
            element: <ConfirmEmail />
         },
      ]
   }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
  </StrictMode>,
);
