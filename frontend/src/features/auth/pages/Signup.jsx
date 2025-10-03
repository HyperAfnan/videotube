import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
const header = "../../public/logo.webp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth.js";
import { notificationService } from "@Shared/services/notification.services.js";

function Input({ name, placeholder, type, ...props }) {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
        placeholder={placeholder}
        {...(props.error && {
          "aria-invalid": true,
          "aria-describedby": `${name}-error`,
        })}
        {...(props.error && { "aria-errormessage": `${name}-error` })}
        {...props}
      />
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup, error } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: validationErrors },
  } = useForm({
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmitHandler(payload) {
    const res = await signup(payload);
    if (res) {
      notificationService.success("Registration successful");
      navigate("/login");
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-4">
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
            onSubmit={handleSubmit(onSubmitHandler, onError)}
            autoComplete="off"
          >
            <Input
              type="text"
              name="username"
              placeholder="username"
              error={validationErrors.username}
              {...register("username", { required: true })}
            />
            <Input
              type="text"
              name="fullname"
              placeholder="fullname"
              error={validationErrors.fullname}
              {...register("fullname", { required: true })}
            />
            <Input
              type="email"
              name="email"
              placeholder="email"
              error={validationErrors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  message: "Invalid email address",
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
                // pattern: {
                //   value:
                //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                //   message:
                //     "Password must contain at least 8 characters, including uppercase, lowercase, and a number",
                // },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <div className="sm:col-span-2">
              <Input
                type="password"
                name="confirmPassword"
                error={validationErrors.confirmPassword}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
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
