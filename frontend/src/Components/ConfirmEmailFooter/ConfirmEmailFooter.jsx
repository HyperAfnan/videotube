import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { closeFooter as close } from "../../Store/FooterSlice.js";

export default function ConfirmEmailFooter() {
  const email = useSelector((state) => state.auth?.userMeta?.email);
  const isFooterClosed = useSelector((state) => state.footer?.isClosed);
  const dispatch = useDispatch();
  const handleResendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/user/sendConfirmEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status !== 200)
        throw new Error("Failed to resend confirmation email");
      const data = await response.json();
      alert(data.message || "Confirmation email resent successfully!");
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      alert(
        "There was an error resending the confirmation email. Please try again later.",
      );
    }
  };

  const closeFooter = () => {
    document.querySelector(".CEFooter").style.display = "none";
    dispatch(close());
  };
  return isFooterClosed ? (
    ""
  ) : (
    <div className=" CEFooter fixed bottom-0 left-0 w-full bg-black text-white font-roboto font-extralight text-center p-4 h-8 flex items-center justify-center  z-50">
      <p>
        Please confirm your email to access all features of the application. If
        you haven't received the confirmation email, check your spam folder or{" "}
        <span
          onClick={handleResendEmail}
          className="underline hover:text-gray-300"
        >
          click here to resend it
        </span>
      </p>
      <X className="right-3 w-auto absolute" onClick={closeFooter} />
    </div>
  );
}
