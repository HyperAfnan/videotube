import { toast } from "sonner";

export const notificationService = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg, options) => toast(msg, options),
  warning: (msg) => toast.warning(msg),
};
