import { useRouteError, Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const errorStatus = error?.status || 500;
  const errorMessage = error?.statusText || error?.message || "An unexpected error occurred";
  const isDevelopment = import.meta.env.DEV;

  const handleRefresh = () => {
    window.location.reload();
  };

  const getErrorTitle = () => {
    switch (errorStatus) {
      case 404:
        return "Page Not Found";
      case 403:
        return "Access Forbidden";
      case 500:
        return "Server Error";
      default:
        return "Something Went Wrong";
    }
  };

  const getErrorDescription = () => {
    switch (errorStatus) {
      case 404:
        return "The page you're looking for doesn't exist.";
      case 403:
        return "You don't have permission to access this resource.";
      case 500:
        return "Our servers are having issues. Please try again later.";
      default:
        return "We encountered an unexpected error. Please try refreshing the page.";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            {getErrorTitle()}
          </CardTitle>
          <p className="text-muted-foreground text-lg mt-2">
            {getErrorDescription()}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details (Development Only) */}
          {isDevelopment && (
            <Alert variant="destructive">
              <AlertDescription className="font-mono text-sm">
                <div className="font-semibold mb-1">Error Details (Dev Mode):</div>
                <div className="text-xs opacity-90">
                  Status: {errorStatus}
                  <br />
                  Message: {errorMessage}
                  {error?.stack && (
                    <>
                      <br />
                      <br />
                      Stack Trace:
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Production Error Message */}
          {!isDevelopment && (
            <Alert>
              <AlertDescription>
                <strong>Error Code:</strong> {errorStatus}
                <br />
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
              onClick={handleRefresh}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Refresh Page
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
          </div>

          {/* Help Section */}
          <div className="pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please{" "}
              <Link to="/support" className="text-primary hover:underline font-medium">
                contact support
              </Link>{" "}
              or try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
