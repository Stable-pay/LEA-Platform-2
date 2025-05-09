import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const WelcomePage = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Stable Pay Fraud Detection System</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Enter Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;