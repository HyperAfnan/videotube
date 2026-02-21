import { Link } from "react-router-dom";
const header = "../../../../public/logo.webp";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import { notificationService } from "@Shared/services/notification.services.js";
import GoogleLoginButton from "../components/GoogleAuthButton.jsx";
import { Button } from "@/components/ui/button.jsx";

function Input({ name, placeholder, type, error, ...rest }) {
   return (
      <div className="w-full mb-4">
         <input
            type={type}
            name={name}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
            placeholder={placeholder}
            {...(error && {
               "aria-invalid": true,
               "aria-describedby": `${name}-error`,
            })}
            {...(error && { "aria-errormessage": `${name}-error` })}
            {...rest}
         />
      </div>
   );
}

export default function Login() {
   const navigate = useNavigate();
   const { login, error } = useAuth();
   const {
      register,
      handleSubmit,
      formState: { errors: validationErrors },
   } = useForm({
      defaultValues: {
         email: "",
         password: "",
      },
   });

   async function onSubmitHandler(payload) {
      const res = await login(payload);
      if (res) {
         notificationService.success("Login successful");
         navigate("/");
      }
      if (error) notificationService.error(error);
   }

   function onError(formErrors) {
      notificationService.error(
         Object.values(formErrors)
            .map((err) => err.message)
            .join(", "),
      );
   }

   return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
         <div className="w-full max-w-md">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
               <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">
                     <Link to="/">
                        <img src={header} alt="Logo" className="h-16 mx-auto mb-6 dark:brightness-0 dark:invert" />
                     </Link>
                  </h1>
               </div>

               <div className="mb-6">
                  <GoogleLoginButton />
               </div>

               <form
                  className="space-y-4"
                  onSubmit={handleSubmit(onSubmitHandler, onError)}
               >
                  <Input
                     type="email"
                     name="email"
                     placeholder="Email"
                     error={validationErrors.email}
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                           message: "Invalid email",
                        },
                     })}
                  />
                  <Input
                     type="password"
                     name="password"
                     placeholder="Password"
                     error={validationErrors.password}
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 6,
                           message: "Password must be at least 6 characters",
                        },
                     })}
                  />
                  <Button
                     type="submit"
                     className="w-full py-5 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                     variant="outline"
                  >
                     Login
                  </Button>
               </form>

               <div className="text-center mt-6 pt-6">
                  <p className="text-gray-600 dark:text-zinc-300 text-sm">
                     Don't have an account?{" "}
                     <Link
                        to="/signup"
                        className="text-black dark:text-white font-medium hover:underline"
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
