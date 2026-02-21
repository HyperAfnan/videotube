import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hook/useAuth.js"

export default function Protected ( { children, auth = true }) {
   const navigate = useNavigate()
   const { isAuthenticated } = useAuth()
   const [loading, setLoading] = useState(true)
   useEffect(() => {
      if (auth && !isAuthenticated ) {
         navigate("/login")
      } else if (!auth && isAuthenticated) {
         navigate("/")
      } else {
         setLoading(false)
      }
      setLoading(false)
   }, [isAuthenticated ? "Authenticated" : "Not Authenticated", navigate, auth])
   return loading ? "" : <>{children}</>
}
