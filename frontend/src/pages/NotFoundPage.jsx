import { Link, useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 px-6 text-center">
          {/* 404 Text */}
          <div className="mb-8">
            <div className="text-[150px] leading-none font-bold bg-linear-to-br from-primary/40 to-primary/10 bg-clip-text text-transparent select-none">
              404
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been removed, 
            renamed, or maybe it never existed in the first place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
            
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Home Page
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/videos">
                <Search className="mr-2 h-5 w-5" />
                Browse Videos
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Looking for something specific?{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                Try searching from the homepage
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
