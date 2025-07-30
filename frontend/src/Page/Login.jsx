import { Link } from "react-router-dom";
const header = "../../public/logo.webp";
import { useDispatch } from "react-redux";
import { login } from "../Store/authSlice.js";
import { useNavigate } from "react-router-dom";

function Input({ name, placeholder, type }) {
   return (
      <div className="w-full mb-4">
         <input
            type={type}
            name={name}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
            placeholder={placeholder}
         />
      </div>
   );
}

export default function Login() {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   async function onSubmitHandler(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      console.log("Form data submitted:", Object.fromEntries(formData.entries()));

      try {
         const res = await fetch("/api/v1/user/login", {
            method: "POST",
            body: formData,
         });
         const data = await res.json();
         console.log("Response data:", data);

         if (res.ok) {
            dispatch(login(data.data));
            navigate("/");
         } else alert(data.message || "Registration failed");
      } catch (err) {
         alert("Network error");
         console.error("Error during registration:", err);
      }
   }
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
         <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8">
               <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">
                     <Link to="/">
                        <img src={header} alt="Logo" className="h-16 mx-auto mb-6" />
                     </Link>
                  </h1>
               </div>

               <form
                  className="space-y-4"
                  onSubmit={onSubmitHandler}
               >
                  <Input type="email" name="email" placeholder="Email" />
                  <Input type="password" name="password" placeholder="Password" />
                  <button
                     type="submit"
                     className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                     Login
                  </button>
               </form>

               <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                     Don't have an account?{" "}
                     <Link
                        to="/signup"
                        className="text-black font-medium hover:underline"
                     >
                        Sign Up
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
