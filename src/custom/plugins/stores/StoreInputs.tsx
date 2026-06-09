import { required } from "ra-core";
import { TextInput } from "@/components/admin/text-input";

export const StoreInputs = () => (
  <div className="flex flex-col gap-4">
    <TextInput source="name" validate={required()} helperText={false} />
    <TextInput source="area_code" helperText={false} />
    <TextInput source="zip" helperText={false} />
    <TextInput source="address" helperText={false} />
    <TextInput source="build" helperText={false} />
  </div>
);
