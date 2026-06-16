import { useEffect, useState } from "react";
import { getSignedUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  bucket: string;
  path: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export function SignedImage({ bucket, path, alt, className, fallbackClassName }: Props) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let active = true;
    getSignedUrl(bucket, path).then((u) => active && setUrl(u));
    return () => {
      active = false;
    };
  }, [bucket, path]);

  if (!path || !url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-accent/40 to-secondary/40 text-muted-foreground text-xs",
          fallbackClassName ?? className,
        )}
      >
        {path ? "Loading…" : "No photo"}
      </div>
    );
  }
  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
