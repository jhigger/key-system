import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import useUsers from "~/hooks/useUsers";
import Loader from "./loader";
import { type RegisterFormSchema } from "./register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type VerificationFormProps = {
  values: z.infer<typeof RegisterFormSchema>;
};

const VerificationForm = ({ values }: VerificationFormProps) => {
  const { isLoaded, signUp } = useSignUp();
  const { setClerkUser } = useUsers();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (code: string) => {
    try {
      if (!isLoaded) throw new Error();
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        toast.error(completeSignUp.status);
      }
      if (completeSignUp.status === "complete") {
        await setClerkUser(signUp.createdSessionId, {
          username: values.username,
          email: values.email,
        });
        window.location.href = "/";
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        toast.error(`Error: ${err.errors[0]?.longMessage}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onSubmit = async ({ pin }: z.infer<typeof FormSchema>) => {
    await handleVerify(pin);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      if (!isLoaded) throw new Error();
      await signUp.create({
        username: values.username,
        emailAddress: values.email,
        password: values.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("A verification code has been sent to your email");
      setResendTimer(60); // Set a 60-second cooldown
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        toast.error(`Error resending code: ${err.errors[0]?.longMessage}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verification</CardTitle>
        <CardDescription>
          Please enter the one-time password sent to your email.
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
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="col-span-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader /> : "Verify"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Didn&apos;t receive the code?{" "}
          <Button
            variant="link"
            className="underline"
            onClick={handleResend}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
