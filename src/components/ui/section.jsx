import { cn } from "@/lib/utils";

export function Section({ className, children, ...props }) {
  return (
    <section
      className={cn("py-16 px-6 md:px-12 max-w-[1200px] mx-auto", className)}
      {...props}
    >
      {children}
    </section>
  );
}
