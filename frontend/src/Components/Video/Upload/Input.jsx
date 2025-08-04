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
    <div className="flex items-center justify-cente">
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

export function TextInput({ name, placeholder, width, height, tooltip, ...props }) {
  const inputRef = useRef(null);
  const divRef = useRef(null);
  const spanRef = useRef(null);
  const tooltipIconRef = useRef(null);

  const ChangeClassName = (element, className, action) => {
    if (action == "add") element.classList.add(className);
    if (action == "remove") element.classList.remove(className);
  };

  const divOnClick = () => inputRef.current.focus();
  const handleChange = (e) => {
    if (e.target.value.length === 0) {
      ChangeClassName(divRef.current, "border-red-800", "add");
      ChangeClassName(divRef.current, "border-black", "remove");

      ChangeClassName(spanRef.current, "text-red-800", "add");
      ChangeClassName(spanRef.current, "text-gar", "remove");

      ChangeClassName(tooltipIconRef.current, "text-red-800", "add");
      ChangeClassName(tooltipIconRef.current, "text-black", "remove");
    }
    if (e.target.value.length !== 0) {
      ChangeClassName(divRef.current, "border-red-800", "remove");
      ChangeClassName(divRef.current, "border-black", "add");

      ChangeClassName(spanRef.current, "text-red-800", "remove");
      ChangeClassName(spanRef.current, "text-black", "add");

      ChangeClassName(tooltipIconRef.current, "text-red-800", "remove");
      ChangeClassName(tooltipIconRef.current, "text-black", "add");
    }
  };
  return (
    <div
      className={ `${width} ${height} overflow-hidden p-2 m-2 border-2 border-gray-300 hover:border-black rounded-xl ` }
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
