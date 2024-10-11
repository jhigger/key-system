import { type Table } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect } from "react";
import { type DateRange } from "react-day-picker";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>;
};

const DatePicker = <TData,>({ className, table }: DatePickerProps<TData>) => {
  const createdAtColumn = table
    .getAllColumns()
    .find((column) => column.id === "expiry" || column.id === "createdAt");
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth());

  const [date, setDate] = React.useState<DateRange | undefined>();

  useEffect(() => {
    if (date) {
      createdAtColumn?.setFilterValue([date?.from, date?.to]);
    }
  }, [date, createdAtColumn]);

  const isDateFiltered = createdAtColumn?.getIsFiltered();

  useEffect(() => {
    if (!isDateFiltered) {
      setDate(undefined);
    }
  }, [isDateFiltered]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-8 min-w-60 justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={baseDate}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(date) => date < new Date("1900-01-01")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
