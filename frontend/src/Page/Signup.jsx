import { Link } from "react-router-dom";
const header = "../../public/logo.webp";
import { useDispatch } from "react-redux";
import { login } from "../Store/authSlice.js";
import { useNavigate } from "react-router-dom";

function Input({ name, placeholder, type, ...props }) {
   return (
      <div className="w-full">
         <input
            type={type}
            name={name}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
            placeholder={placeholder}
            {...props}
         />
      </div>
   );
}

export default function Signup() {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   async function onSubmitHandler(e) {
      e.preventDefault();
      const formData = new FormData(e.target);

      try {
         const res = await fetch("/api/v1/user/register", {
            method: "POST",
            body: formData,
         });
         const data = await res.json();

         if (res.ok) {
            dispatch(login(data.data));
            navigate("/")

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
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  method="POST"
                  action="/api/v1/users/register"
                  encType="multipart/form-data"
                  onSubmit={onSubmitHandler}
               >
                  <Input type="text" name="username" placeholder="username" />
                  <Input type="text" name="fullname" placeholder="fullname" />
                  <Input type="email" name="email" placeholder="email" />
                  <Input type="password" name="password" placeholder="Password" />

                  <div className="sm:col-span-2">
                     <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                     />
                  </div>

                  <div className="sm:col-span-2">
                     <button
                        type="submit"
                        className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                     >
                        Sign Up
                     </button>
                  </div>
               </form>

               <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                     Already have an account?{" "}
                     <Link
                        to="/login"
                        className="text-black font-medium hover:underline"
                     >
                        Login
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
