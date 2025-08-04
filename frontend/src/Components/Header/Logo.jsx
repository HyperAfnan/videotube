import { Link } from "react-router-dom";
const image = "../../../public/logo.webp";
export default function Logo() {
  return (
    <div className="w-[170px]">
      <Link to="/">
        <img src={image} alt="logo" height="80px" width="170px" />
      </Link>
    </div>
  );
}
