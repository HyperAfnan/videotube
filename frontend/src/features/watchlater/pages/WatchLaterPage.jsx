import Container from "@Shared/components/Container.jsx";
import WatchLaterRightSideContainer from "../components/WatchLaterRightSideContainer.jsx";
import WatchLaterLeftSideComponent from "../components/WatchLaterLeftSideComponent.jsx";
import { useWatchLater } from "../hook/useWatchLaterQueries.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function WatchLaterPage() {
   const { error, isLoading } = useWatchLater();
   if (isLoading) {
      return (
         <Container>
            <div className="flex justify-center items-center h-screen">
               <div className="space-y-4 w-full max-w-4xl">
                  <Skeleton className="h-[200px] w-full rounded-2xl" />
                  <Skeleton className="h-[120px] w-full rounded-lg" />
                  <Skeleton className="h-[120px] w-full rounded-lg" />
               </div>
            </div>
         </Container>
      );
   }
   
   if (error) return (
      <Container>
         <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Error: {error}</AlertDescription>
         </Alert>
      </Container>
   );

   return (
      <Container>
         <WatchLaterLeftSideComponent />
         <WatchLaterRightSideContainer />
      </Container>
   );
}
