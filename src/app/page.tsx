import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Next.js 15 + shadcn/ui + TypeScript
          </h1>
          <p className="text-xl text-muted-foreground">
            🎉 Successfully set up with all components working!
          </p>
        </div>

        {/* Test Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons Section */}
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>
                Testing different button variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input Component</CardTitle>
              <CardDescription>Testing input functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Type something here..." />
              <Input type="email" placeholder="email@example.com" />
              <Input type="password" placeholder="Password" />
            </CardContent>
          </Card>

          {/* Avatar & Badge Section */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar & Badge Components</CardTitle>
              <CardDescription>Testing user profile elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">shadcn</p>
                  <div className="flex space-x-2">
                    <Badge>Online</Badge>
                    <Badge variant="secondary">Pro</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Chat Interface Preview</CardTitle>
              <CardDescription>
                A preview of what our chat app might look like
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-2 rounded-lg">
                    <p className="text-sm">Hello! How can I help you today?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 justify-end">
                  <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                    <p className="text-sm">This looks great!</p>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500">✓</Badge>
              <p className="text-lg font-semibold text-green-800 dark:text-green-200">
                Setup Complete!
              </p>
            </div>
            <p className="mt-2 text-green-700 dark:text-green-300">
              Next.js 15 with TypeScript and shadcn/ui is ready for development.
              All components are working correctly and the development server is
              running.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
