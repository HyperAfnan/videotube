import { Link } from 'react-router-dom';

export default function ConfirmEmailFooter() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white font-roboto font-extralight text-center p-4 h-8 flex items-center justify-center  z-50">
      <p>
        Please confirm your email to access all features of the application.
        If you haven't received the confirmation email, check your spam folder or{" "}
        <Link to="/resend-confirmation" className="underline hover:text-gray-300">
          click here to resend it
        </Link>.
      </p>
    </div>
  );
}
