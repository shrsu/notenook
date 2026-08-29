import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import SuccessAlert from "../SuccessAlert";
import ActionLoader from "../Loaders/ActionLoader";

const formSchema = z.object({
  otp: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});

function OTPVerificationForm({ userData }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleFormSubmit = async (data) => {
    setResendSuccess(false);
    setIsLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_VERIFY_OTP_URL,
        {
          userId: userData._id,
          otp: data.otp,
        }
      );
      if (res.status === 200) {
        setSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Failed to verify OTP";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setErrorMessage("");
    setResendSuccess(false);
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_RESEND_OTP_URL,
        {
          email: userData.email,
        }
      );
      if (res.status === 200) {
        setResendSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Failed to resend OTP";
      setErrorMessage(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <div className="relative flex flex-col items-center">
      <SuccessAlert success={success} path={"Login"} />
      {isLoading && <ActionLoader action={"Verifying OTP..."} />}
      {isResending && <ActionLoader action={"Resending OTP..."} />}
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">OTP Verification</h2>
        <CardDescription>
          The OTP has been mailed to <b>{userData?.email}</b>
        </CardDescription>
        {errorMessage && (
          <h2 className="text-lg font-bold text-red-500">{errorMessage}</h2>
        )}
        {resendSuccess && (
          <h2 className="text-lg font-bold text-green-500">
            OTP sent successfully
          </h2>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-12"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>Enter your OTP.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex span2 justify-center gap-16">
              <div
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer hover:bg-neutral-900"
                onClick={handleResendOTP}
              >
                Resend OTP
              </div>
              <Button type="submit">Verify OTP</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default OTPVerificationForm;
