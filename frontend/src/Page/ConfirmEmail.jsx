import { Link } from "react-router-dom";
const header = "../../public/logo.webp";

export default function ConfirmEmail() {
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
                  <h1 className="text-md font-semibold text-black">
                     Congratulations! Your email has been successfully confirmed.
                  </h1>
                 <Link to="/">
                     <button className="mt-4  py-3 px-10 rounded-lg font-medium  text-md bg-black text-white hover:bg-gray-800 transition-colors">
                        Go to Home
                     </button>
                 </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
