import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hook/useAuth.js";

export default function AuthInitializer({ children }) {
   const queryClient = useQueryClient();
   const { refreshToken, isLoading, isError } = useAuth();
   useEffect(() => {
      const userMeta = JSON.parse(localStorage.getItem("user"));
      if (userMeta) {
         refreshToken(userMeta).then((data) => {
            queryClient.setQueryData(["user"], data.user);
         });
      }
   }, [refreshToken, queryClient]);

   if (isLoading) return null;
   if (isError) return <div>Authentication failed. Please log in again.</div>;
   return children;
}
