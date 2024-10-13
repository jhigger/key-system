import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";

type LoaderProps = {
  className?: string;
};

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={cn("flex justify-center", className)}>
      <LoaderCircle className="animate-spin" />
    </div>
  );
};

export default Loader;
