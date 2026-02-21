import { useFormContext } from "react-hook-form";
import { useUserPlaylist } from "@Features/playlist/hook/usePlaylistQueries.js";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadPlaylist = () => {
  const { register, setValue, watch } = useFormContext();
  const { data: playlists = [], isLoading } = useUserPlaylist();
  const playlist = watch("playlist");

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Label className="text-base font-semibold text-foreground">Playlist</Label>
      <p className="text-sm text-muted-foreground">Add your video to a playlist...</p>
      <Select
        value={playlist || undefined}
        onValueChange={(value) => setValue("playlist", value === "none" ? null : value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-1/2">
          <SelectValue placeholder={isLoading ? "Loading playlists..." : "Select a playlist"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {playlists.map((playlist) => (
            <SelectItem key={playlist?._id} value={playlist?._id}>
              {playlist?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UploadPlaylist;
