"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bot,
  CircleDashed,
  Loader2,
  Send,
  Sparkles,
  User,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingState = "idle" | "generating" | "polling" | "completed" | "publishing" | "published" | "error";

interface GeneratedPost {
  postContent: string;
  imageUrl: string;
}

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long."),
  instructions: z.string().optional(),
  image: z.string().optional(),
});

export default function Home() {
  const { toast } = useToast();
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [linkedinAuthToken, setLinkedinAuthToken] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      instructions: "",
      image: "",
    },
  });

  const isProcessing = loadingState === 'generating' || loadingState === 'polling' || loadingState === 'publishing';

  const cleanupPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupPolling();
  }, []);

  const startPolling = (id: string) => {
    cleanupPolling(); // Ensure no multiple intervals running
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/fetch-results?executionId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const result = await response.json();

        if (result.status === 'completed') {
          cleanupPolling();
          setGeneratedPost(result.data);
          setLoadingState("completed");
          toast({
            title: "Content Generated!",
            description: "Your post is ready for review.",
          });
        } else if (result.status === 'failed') {
          cleanupPolling();
          setLoadingState('error');
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to generate content.",
          });
        }
        // If 'processing', do nothing and wait for the next poll
      } catch (error) {
        cleanupPolling();
        setLoadingState('error');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not poll for results. Please try again.",
        });
      }
    }, 3000);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingState("generating");
    setGeneratedPost(null);
    setExecutionId(null);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to start generation job");
      }

      const { executionId: newExecutionId } = await response.json();
      setExecutionId(newExecutionId);
      setLoadingState("polling");
      startPolling(newExecutionId);
    } catch (error) {
      setLoadingState("error");
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not start the content generation process.",
      });
    }
  };
  
  const handleApproveAndPost = async () => {
    if (!generatedPost || !linkedinAuthToken) {
      toast({
        variant: 'destructive',
        title: 'Cannot Post',
        description: 'Please sign in with LinkedIn and ensure content is generated.'
      });
      return;
    }

    setLoadingState('publishing');
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentToPost: generatedPost.postContent,
          imageToPostUrl: generatedPost.imageUrl,
          linkedinAuthToken
        }),
      });

      if (!response.ok) {
        throw new Error('Publication failed');
      }
      const result = await response.json();
      setLoadingState('published');
      toast({
        title: 'Success!',
        description: result.message,
      });

      // Reset for next post
      setTimeout(() => {
        setLoadingState('idle');
        setGeneratedPost(null);
        form.reset();
      }, 3000);

    } catch (error) {
      setLoadingState('completed'); // Revert to allow another attempt
      toast({
        variant: 'destructive',
        title: 'Publishing Error',
        description: 'Could not post to LinkedIn. Please try again.'
      })
    }
  };
  
  const handleSignIn = () => {
    // This is a mock authentication
    setLinkedinAuthToken("mock-oauth-token-12345");
    toast({
      title: "Signed In",
      description: "You've successfully signed in with LinkedIn.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">LinkedEase</h1>
        </div>
        <Button onClick={handleSignIn} disabled={!!linkedinAuthToken}>
          <User className="mr-2 h-4 w-4" />
          {linkedinAuthToken ? "Signed In" : "Sign in with LinkedIn"}
        </Button>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-2">
            <Card className="h-full shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                      <Sparkles className="text-accent" />
                      Create Your Next LinkedIn Post
                    </CardTitle>
                    <CardDescription>
                      Provide the details and let our AI craft the perfect post for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Post Description / Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'Announcing our new AI-powered analytics feature'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Post Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., 'Write in a friendly and exciting tone. Include 3 bullet points about the benefits. Add relevant hashtags like #AI #DataAnalytics.'"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Prompt / URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="A photorealistic image of a robot writing a social media post, or a URL." {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isProcessing} size="lg">
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {loadingState === 'generating' && 'Generating...'}
                          {loadingState === 'polling' && 'Crafting Post...'}
                          {loadingState === 'publishing' && 'Publishing...'}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">Post Preview</CardTitle>
                <CardDescription>
                  Your generated post will appear here for review.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg m-6 mt-0">
                {loadingState === 'idle' || loadingState === 'error' || loadingState === 'published' ? (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12" />
                    <p className="mt-2">Waiting for content to generate...</p>
                  </div>
                ) : loadingState === 'generating' || loadingState === 'polling' ? (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-center text-primary mb-4">
                       <CircleDashed className="h-8 w-8 animate-spin" />
                       <p className="ml-4 font-semibold">Generating your post...</p>
                    </div>
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : generatedPost && (
                  <div className="w-full space-y-4">
                    <div className="aspect-video w-full relative overflow-hidden rounded-lg border">
                      <Image
                        src={generatedPost.imageUrl}
                        alt="Generated Post Image"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="social media professional"
                      />
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{generatedPost.postContent}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={loadingState !== "completed" || !linkedinAuthToken}
                  onClick={handleApproveAndPost}
                >
                  {loadingState === 'publishing' ? (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Approve & Post to LinkedIn
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
