import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import useUsers from "~/hooks/useUsers";
import Loader from "./loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
});

export function LoginForm() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { setSession } = useUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    try {
      if (!isSignInLoaded) throw new Error("Sign-in not loaded");
      const completeSignIn = await signIn.create({
        strategy: "password",
        identifier: email,
        password,
      });
      if (completeSignIn.status !== "complete") {
        toast.error(completeSignIn.status);
      }
      if (completeSignIn.status === "complete") {
        await setSession(completeSignIn.createdSessionId);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        toast.error(`Error: ${err.errors[0]?.longMessage}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleLogin(values);
  };

  if (!isSignInLoaded) {
    return <Loader />;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader /> : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
