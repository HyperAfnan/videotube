import { useRef } from "react";
import { CircleQuestionMark } from "lucide-react";

function Tooltip({ text, ref }) {
  const tooltipSpanRef = useRef(null);
  const handleMouseEnter = () => {
    if (tooltipSpanRef.current.classList.contains("hidden"))
      tooltipSpanRef.current.classList.remove("hidden");
    else tooltipSpanRef.current.classList.add("hidden");
  };
  return (
    <div className="flex items-center justify-center">
      <CircleQuestionMark
        ref={ref}
        className="inline-block ml-1 text-gray-500 cursor-pointer"
        size={16}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseEnter}
      />
      <span
        ref={tooltipSpanRef}
        className="absolute z-10  hidden bg-gray-800 text-white text-xs rounded px-2 py-1"
      >
        {text}
      </span>
    </div>
  );
}

export function TextInput({
  name,
  placeholder,
  width,
  height,
  tooltip,
  ...props
}) {
  const inputRef = useRef(null);
  const divRef = useRef(null);
  const spanRef = useRef(null);
  const tooltipIconRef = useRef(null);

  const divOnClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleChange = (e) => {
    if (e.target.value.length === 0) {
      divRef.current.classList.add("border-red-800", "hover:border-red-800");
      divRef.current.classList.remove("border-black");

      spanRef.current.classList.add("text-red-800");
      spanRef.current.classList.remove("text-black");

      tooltipIconRef.current.classList.add("text-red-800");
      tooltipIconRef.current.classList.remove("text-black");
    }
    if (e.target.value.length !== 0) {
      divRef.current.classList.remove("border-red-800", "hover:border-red-800");
      divRef.current.classList.add("border-black");

      spanRef.current.classList.remove("text-red-800");
      spanRef.current.classList.add("text-black");

      tooltipIconRef.current.classList.remove("text-red-800");
      tooltipIconRef.current.classList.add("text-black");
    }
  };
  return (
    <div
      className={`${width} ${height} overflow-hidden p-2 m-2 border-2 border-gray-300 hover:border-black rounded-xl `}
      ref={divRef}
      onClick={divOnClick}
    >
      <label className={`block font-medium text-gray-600 mb-2  `}>
        <div className={`flex items-center space-x-2 `}>
          <span className="text-xs" ref={spanRef}>
            {name}
          </span>
          <Tooltip text={tooltip} ref={tooltipIconRef} />
        </div>
        <input
          type="text"
          ref={inputRef}
          name={name}
          className={`w-full px-4 text-sm py-3 rounded-lg focus:outline-none transition-colors `}
          autoComplete="off"
          onKeyUp={handleChange}
          placeholder={placeholder}
          {...props}
        />
      </label>
    </div>
  );
}
