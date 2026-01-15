import { Progress } from "@/components/ui/progress";

export default function UploadProgress({ progress }) {
  return (
    <Progress value={progress} className="w-full h-1 rounded-full" />
  );
}
