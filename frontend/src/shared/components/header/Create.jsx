import { UploadComponent } from "@Features/video/components/UploadVideoOverlay/index.js";
import { useFloatingMenu } from "@Shared/hooks/useFloatingMenu.js";
import { Plus, FilePlay } from "lucide-react";

export default function Create() {
  const {
    isOpen: menuOpen,
    setIsOpen: setMenuOpen,
    refs: menuRefs,
    floatingStyles: menufloatingStyles,
    getReferenceProps: getMenuReferenceProps,
    getFloatingProps: getMenuFloatingProps,
  } = useFloatingMenu({ placement: "bottom", offset: { mainAxis: 5 } });

  const {
    isOpen: componentOpen,
    setIsOpen: setComponentOpen,
    refs: componentRefs,
    floatingStyles: componentFloatingStyles,
    getReferenceProps: getComponentReferenceProps,
    getFloatingProps: getComponentFloatingProps,
  } = useFloatingMenu({ placement: "bottom", offset: { mainAxis: 5 } });

  const handleUploadClick = () => {
    setMenuOpen(false);
    setComponentOpen(true);
  };

  return (
    <div>
      <button
        type="button"
        ref={menuRefs.setReference}
        {...getMenuReferenceProps()}
        className="bg-black px-5 w-[120px] py-2 rounded-full hover:border-gray-500 hover:bg-gray-800 border-2 border-black"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <div className="flex justify-center items-center space-x-1 w-full">
          <Plus /> <span> Create</span>
        </div>
      </button>
      {menuOpen && (
        <div
          className="w-40 bg-black text-white rounded-xl shadow-lg"
          ref={menuRefs.setFloating}
          style={{ ...menufloatingStyles }}
          {...getMenuFloatingProps()}
        >
          <div className="flex flex-col">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700"
              ref={componentRefs.setReference}
              {...getComponentReferenceProps()}
              onClick={handleUploadClick}
            >
              <FilePlay className="text-gray-300" />
              Upload video
            </button>
          </div>
        </div>
      )}
      {componentOpen && (
        <UploadComponent
          setOpen={setComponentOpen}
          ref={componentRefs.setFloating}
          floatingStyles={componentFloatingStyles}
          getFloatingProps={getComponentFloatingProps}
        />
      )}
    </div>
  );
}

