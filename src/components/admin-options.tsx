import { Eye, FilePenLine, Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useAdminOptions from "~/hooks/useAdminOptions";
import { useUIStore } from "~/state/ui.store";
import DebouncedInput from "./debounced-input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const AdminOptions = () => {
  const { editMode, toggleEditMode } = useUIStore();
  const {
    query: { data: adminOptions, isLoading, isError },
    mutation: { editAdminOption },
  } = useAdminOptions();

  if (isError) {
    return <div className="flex justify-center p-4">Error fetching data</div>;
  }

  if (isLoading) {
    return <Loader className="p-4" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-y-1.5">
            <CardTitle>Options</CardTitle>
            <CardDescription>A list of admin option.</CardDescription>
          </div>
          <div className="flex flex-col items-end justify-between">
            <Switch
              id="mode"
              checked={editMode}
              onCheckedChange={toggleEditMode}
              icon={
                editMode ? (
                  <FilePenLine className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )
              }
            />
            <CardDescription>
              {editMode ? "Edit Mode" : "View Mode"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {Array.isArray(adminOptions) &&
          adminOptions.map((adminOption) => (
            <div
              key={adminOption.uuid}
              className="flex flex-col justify-center gap-2"
            >
              <Label htmlFor={adminOption.uuid}>{adminOption.name}</Label>
              {editMode ? (
                <DebouncedInput
                  id={adminOption.uuid}
                  type={
                    adminOption.name === "Minimum Purchase" ? "number" : "text"
                  }
                  value={String(adminOption.value)}
                  className="w-full max-w-[200px]"
                  min="0"
                  step="0.01"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.includes(".")) {
                      const [whole, decimal] = input.value.split(".");
                      if (decimal && decimal.length > 2) {
                        input.value = `${whole}.${decimal.slice(0, 2)}`;
                      }
                    }
                  }}
                  onChange={(value) => {
                    const numValue = Math.max(0, Number(value));
                    if (!isNaN(numValue)) {
                      editAdminOption({
                        ...adminOption,
                        value: String(parseFloat(numValue.toFixed(2))),
                      });
                    }
                  }}
                />
              ) : (
                <CardDescription id={adminOption.uuid}>
                  {adminOption.value}
                </CardDescription>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default AdminOptions;
