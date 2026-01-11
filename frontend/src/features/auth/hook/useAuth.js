import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService.js";
import { AUTH_KEYS } from "@/lib/queryKeys.js";

export const useAuth = () => {
   const queryClient = useQueryClient();

   // Fetch authenticated user from localStorage
   const {
      data: user,
      error: fetchError,
      isLoading: isFetching,
   } = useQuery({
      queryKey: AUTH_KEYS.user,
      queryFn: async () => {
         const userMeta = JSON.parse(localStorage.getItem("user"));
         return userMeta || null;
      },
      staleTime: Infinity,
   });

   // Login mutation
   const {
      mutateAsync: login,
      error: loginError,
      isLoading: isLoggingIn,
   } = useMutation({
      mutationFn: authService.login,
      onSuccess: (data) => {
         localStorage.setItem("user", JSON.stringify(data.user));
         queryClient.setQueryData(AUTH_KEYS.user, data.user);
      },
   });

   // Signup mutation
   const {
      mutateAsync: signup,
      error: signupError,
      isLoading: isSigningUp,
   } = useMutation({
      mutationFn: authService.signup,
   });

   // Logout mutation
   const {
      mutateAsync: logout,
      error: logoutError,
      isLoading: isLoggingOut,
   } = useMutation({
      mutationFn: authService.logout,
      onSuccess: () => {
         localStorage.removeItem("user");
         queryClient.setQueryData(AUTH_KEYS.user, null);
      },
   });

   // Login with Google mutation
   const {
      mutateAsync: loginWithGoogle,
      error: googleLoginError,
      isLoading: isGoogleLoggingIn,
   } = useMutation({
      mutationFn: authService.loginWithGoogle,
      onSuccess: (data) => {
         localStorage.setItem("user", JSON.stringify(data.user));
         queryClient.setQueryData(AUTH_KEYS.user, data.user);
      },
   });

   // Refresh token mutation
   const {
      mutateAsync: refreshToken,
      error: refreshTokenError,
      isLoading: isRefreshingToken,
   } = useMutation({
      mutationFn: authService.refreshToken,
      onSuccess: (data) => {
         localStorage.setItem("user", JSON.stringify(data.user));
         queryClient.setQueryData(AUTH_KEYS.user, data.user);
      },
   });

   const error =
      fetchError || loginError || signupError || logoutError || googleLoginError || refreshTokenError;
   const isAuthenticated = !!user;
   const isLoading =
      isFetching ||
      isLoggingIn ||
      isSigningUp ||
      isLoggingOut ||
      isGoogleLoggingIn
      || isRefreshingToken;

   return {
      user,
      error,
      login,
      logout,
      signup,
      loginWithGoogle,
      isAuthenticated,
      refreshToken,
      isLoading,
   };
};
