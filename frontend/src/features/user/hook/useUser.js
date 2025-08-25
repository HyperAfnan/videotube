import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../services/user.services.js";
import {
   setProfile,
   setPreferences,
   setSubscription,
} from "../store/userSlice.js";
import { useState } from "react";

export function useUser() {
   const dispatch = useDispatch();
   const user = useSelector((state) => state.user);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);


   return {
      ...user,
      error,
      loading,
   };
}
