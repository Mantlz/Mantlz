import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>Your feedback has been submitted successfully</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            We appreciate you taking the time to share your thoughts with us. 
            Your feedback helps us improve our services and provide a better experience.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/feedback-demo">
            <Button>Return to Demo</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}