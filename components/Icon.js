import * as Icons from "lucide-react";

// Renders a lucide icon by name so data files can stay serializable.
export default function Icon({ name, className = "h-5 w-5", ...props }) {
  const Cmp = Icons[name] || Icons.Circle;
  return <Cmp className={className} aria-hidden="true" {...props} />;
}
