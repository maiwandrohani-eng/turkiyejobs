import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  height?: number;
  width?: number;
};

/** Transparent wordmark — red “turkiye”, teal “jobs”. */
export function LogoMark({ className, height = 44, width = 220 }: LogoMarkProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/logo.png"
        alt="TürkiyeJobs.org"
        width={width}
        height={height}
        className="h-9 w-auto sm:h-10 md:h-11"
        priority
      />
    </span>
  );
}
