import { useAuth } from "@Features/auth/hook/useAuth.js";
const Dashboard = () => {
   const { user: userMeta } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">Dashboard </h1>
      <div className="flex justify-evenly items-center ">
        <div>
          <img
            src={userMeta.avatar}
            alt={userMeta.name}
            className="w-48 h-48 rounded-xl shadow-lg " 
          />
        </div>
         <div className="">
            <h2 className="text-xl font-semibold mt-4">Welcome, {userMeta.fullname}!</h2>
            <p className="text-gray-600 mt-2">Email: {userMeta.username}</p>
            <p className="text-gray-600 mt-2">Joined on: {new Date(userMeta.createdAt).toLocaleDateString()}</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
