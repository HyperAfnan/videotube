import { House, UserRound, ListVideo, Clock } from "lucide-react"; 
import { Link } from "react-router-dom";

const SideBar = () => {
  const isSideBarElement = [
    { to: "/", icon: <House className="w-15" /> },
    { to: "/subscriptions", icon: <ListVideo className="w-15" /> },
    { to: "/feed/user", icon: <UserRound className="w-15" /> },
    { to: "/watchlater", icon: <Clock className="w-15" /> },
  ];
  return (
    <div className="flex flex-col items-center h-full w-[72px] pr-1 pl-1 m-0 fixed top-0">
      <div className="pt-4">
        <div className="flex flex-col items-center h-screen w-full space-y-3">
          {isSideBarElement.map((element, index) => (
            <Link
              key={element.to + index}
              to={element.to}
              className="flex items-center justify-center  pt-2 pb-2 m-0 hover:bg-gray-100 rounded-xl  w-full "
            >
              {element.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
