import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@Shared/services/notification.services";

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await loginWithGoogle(credentialResponse.credential);
      if (result) {
        notificationService.success("Logged in successfully with Google!");
        navigate("/");
      }
    } catch (error) {
      notificationService.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    notificationService.error("Google login failed. Please try again.");
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
      />
    </div>
  );
}
