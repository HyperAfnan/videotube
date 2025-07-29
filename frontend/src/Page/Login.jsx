import { Link } from "react-router-dom";

const header = "../../public/logo.webp";

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

function onSubmitHandler(e) {
  e.preventDefault();
  console.log("user logged in");
}

export default function Login() {
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

          <form className="space-y-4">
            <Input type="email" name="email" placeholder="Email" />
            <Input type="password" name="password" placeholder="Password" />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              onClick={onSubmitHandler}
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
