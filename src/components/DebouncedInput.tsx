import { useEffect, useState, type InputHTMLAttributes } from "react";
import { Input } from "./ui/input";

export type DebouncedInputProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

function DebouncedInput<T extends string | number>({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps<T>) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce, initialValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value as T)}
    />
  );
}

export default DebouncedInput;
