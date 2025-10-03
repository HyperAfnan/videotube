import { Link } from "react-router-dom";

export default function ProfilePic({ userMeta }) {
  return (
    <div className="hover:border-gray-500 border-2 border-black rounded-full h-10 w-10">
      <Link to="/dashboard">
        <img
          src={userMeta?.avatar}
          alt={userMeta?.username}
          className="h-full w-full rounded-full object-cover"
        />
      </Link>
    </div>
  );
}
