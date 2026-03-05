import { useState } from "react";
import {
   autoUpdate,
   flip,
   offset,
   shift,
   useClick,
   useDismiss,
   useFloating,
   useInteractions,
   useRole,
} from "@floating-ui/react";

export const useFloatingMenu = ({ placement = "right-start", offset: offsetValue = 10 } = {}) => {
   const [isOpen, setIsOpen] = useState(false);

   const { refs, floatingStyles, context } = useFloating({
      placement,
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [offset(offsetValue), flip(), shift()],
      whileElementsMounted: autoUpdate,
   });

   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);

   const { getReferenceProps, getFloatingProps } = useInteractions([ click, dismiss, role ]);

   return {
      isOpen,
      setIsOpen,
      refs,
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
   };
};
