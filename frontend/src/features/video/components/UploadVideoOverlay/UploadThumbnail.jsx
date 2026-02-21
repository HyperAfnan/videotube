import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const UploadThumbnail = ({ setThumbnail, videoMeta }) => {
  const { setValue } = useFormContext();
  
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div>
        <Label className="text-base font-semibold text-foreground">Thumbnail</Label>
        <p className="text-sm text-muted-foreground">
          Set a thumbnail that stands out...
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label htmlFor="thumbnail">
          <Button
            variant="outline"
            className="cursor-pointer"
            asChild
          >
            <span>Select Thumbnail</span>
          </Button>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setThumbnail(URL.createObjectURL(file));
                setValue("thumbnail", file);
              }
            }}
            hidden
          />
        </label>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setThumbnail(videoMeta?.thumbnail);
            setValue("thumbnail", videoMeta?.thumbnail);
          }}
        >
          Use Default
        </Button>
      </div>
    </div>
  );
};

export default UploadThumbnail;
