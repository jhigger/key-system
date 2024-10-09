import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            type === "password" && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <Button
            variant={"ghost"}
            size={"icon"}
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 transform" // Position the button
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
