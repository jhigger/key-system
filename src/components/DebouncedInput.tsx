import {
  useCallback,
  useEffect,
  useState,
  type InputHTMLAttributes,
} from "react";
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

  const debouncedOnChange = useCallback(
    (value: T) => {
      const handler = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => {
        clearTimeout(handler);
      };
    },
    [onChange, debounce],
  );

  useEffect(() => {
    if (value !== initialValue) {
      return debouncedOnChange(value);
    }
  }, [value, initialValue, debouncedOnChange]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value as T)}
    />
  );
}

export default DebouncedInput;
