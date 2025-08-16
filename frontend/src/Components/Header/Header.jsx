import { useSelector } from "react-redux";
import { Logo, SearchBar, Create, ProfilePic, Button } from "./index.js";
import { Menu } from "lucide-react";

export default function Header() {
  const auth = useSelector((state) => state.auth);

  return (
    <div className=" flex items-center justify-center p-2 font-roboto bg-white/10 backdrop-blur-3xl border-b border-white/20 fixed w-full top-0 z-50">
      <Menu className="w-[70px]" />
      <Logo />
      <SearchBar />
      {auth?.status ? (
        <div className="flex items-center justify-center w-[280px] space-x-4 text-white text-large ">
          <Create />
          <ProfilePic userMeta={auth?.userMeta} />
        </div>
      ) : (
        <div className="flex items-center justify-center w-2xs space-x-4 text-white text-large ">
          <Button to="/login" text="Login" />
          <Button to="/signup" text="Signup" />
        </div>
      )}
    </div>
  );
}
