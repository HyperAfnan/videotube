import { FloatingPortal } from "@floating-ui/react";
import { useFloatingMenu } from "@Shared/hooks/useFloatingMenu.js";

const MenuButton = ({ children, onClick, buttonClasses, textClasses }) => {
  return (
    <button
      className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-4 ${buttonClasses}`}
      onClick={onClick}
      type="button"
    >
      <span className={`text-sm text-black ${textClasses}`}>{children}</span>
    </button>
  );
};

export const Menu = ({ trigger, triggerClasses, children, menuClasses }) => {
  const {
    isOpen,
    setIsOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  } = useFloatingMenu();

  return (
    <div className="w-full flex justify-end ">
      <div
        className={`w-5 h-5 text-gray-500 cursor-pointer ${triggerClasses}`}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {trigger}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            className={` flex flex-row shadow-lg rounded-xl  ${menuClasses}`}
            ref={refs.setFloating}
            style={{ ...floatingStyles }}
            {...getFloatingProps()}
          >
            {children.map((option, index) => (
              <MenuButton
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  option.onClick();
                }}
                buttonClasses={option.buttonClasses}
                textClasses={option.textClasses}
              >
                {option.icon && (
                  <span className="inline mr-2">{option.icon}</span>
                )}
                {option.label}
              </MenuButton>
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
