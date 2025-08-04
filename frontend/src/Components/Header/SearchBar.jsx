import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
      <div className="text-black w-full flex justify-center ">
        <div className="pl-4 pr-4 pb-2 pt-2 border-2 border-gray-200 rounded-full flex justify-center ">
          <Search className="text-gray-500 mr-3" />
          <input name="search" className=" w-xl focus:outline-none " />
        </div>
      </div>
  )
}

