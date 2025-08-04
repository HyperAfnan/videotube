import { Link } from "react-router-dom"
export default function Button( { to, text }) {
  return (
          <Link to={to}>
            <button className=" bg-black px-5 py-2 rounded-md border-2 border-gray-200 ">
              {text}
            </button>
          </Link>
  )
}

