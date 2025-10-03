import { cn } from "@Lib/utils";

/**
 * Container component with dark mode support
 * Provides consistent spacing and responsive layout for page content
 */
export default function Container({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "h-screen w-full flex flex-col pt-16 pl-16 bg-background text-foreground transition-colors duration-300 dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
      {...props}
    >
      <main className="flex-grow p-6 transition-colors">{children}</main>
    </div>
  );
}
