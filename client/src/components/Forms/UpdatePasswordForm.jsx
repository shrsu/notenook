import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardDescription } from "@/components/ui/card";

import ActionLoader from "../Loaders/ActionLoader";
import SuccessAlert from "../SuccessAlert";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const formSchema = z
  .object({
    password: z.string().min(1, "Enter your old Password"),
    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function UpdatePasswordForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccess(false);

    try {
      const token = extractTokenFromCookie();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.patch(
        import.meta.env.VITE_REACT_APP_USER_DETAIL_UPDATE_PASSWORD_ENDPOINT,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response)
      if (response.status === 200) {
        setSuccess(true);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col bg-[#09090B] py-8 px-4 rounded-md">
      {success && <SuccessAlert success={success} path="Profile" />}
      {isLoading && <ActionLoader action="Updating..." />}

      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Update Password</h2>
        <CardDescription>Change your password and click Update</CardDescription>
        {errorMessage && (
          <p aria-live="assertive" className="text-lg font-bold text-red-500">
            {errorMessage}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="text-black" />
                  </FormControl>
                  <FormDescription>Your current password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="text-black" />
                  </FormControl>
                  <FormDescription>Your new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="text-black" />
                  </FormControl>
                  <FormDescription>Re-enter your new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default UpdatePasswordForm;
