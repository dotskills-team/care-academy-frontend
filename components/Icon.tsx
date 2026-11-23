import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconComponent = React.ComponentType<LucideProps>;

// Renders a lucide icon by name so data files can stay serializable.
// Unknown names fall back to a plain circle.
export default function Icon({ name, className = "h-5 w-5", ...props }: { name: string } & LucideProps) {
  const Cmp = (Icons as unknown as Record<string, IconComponent | undefined>)[name] ?? Icons.Circle;
  return <Cmp className={className} aria-hidden="true" {...props} />;
}
