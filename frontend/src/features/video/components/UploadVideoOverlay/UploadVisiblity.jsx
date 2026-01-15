import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadVisiblity = () => {
  const { setValue, watch } = useFormContext();
  const visibility = watch("visibility");

  return (
    <div className="flex flex-col space-y-4 w-full pb-6">
      <Label className="text-base font-semibold text-foreground">Visibility</Label>
      <p className="text-sm text-muted-foreground">Choose who can see your video</p>
      <Select
        value={visibility}
        onValueChange={(value) => setValue("visibility", value)}
      >
        <SelectTrigger className="w-1/2">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="unlisted">Unlisted</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UploadVisiblity;
