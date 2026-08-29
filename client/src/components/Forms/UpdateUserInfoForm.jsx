import { useState, useContext } from "react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, CardHeader, CardDescription } from "@/components/ui/card";

import ActionLoader from "../Loaders/ActionLoader";
import SuccessAlert from "../SuccessAlert";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import { UserContext } from "../../context/userContext";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]{3,30}$/,
      "Can contain only letters, numbers, underscores, and dashes"
    ),
  fullname: z.string().min(1, "Enter Full name"),
});

function UpdateUserForm({ username, fullname }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { setUser } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username,
      fullname: fullname,
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
        import.meta.env.VITE_REACT_APP_USER_DETAIL_UPDATE_ENDPOINT,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          username: data.username,
          fullname: data.fullname,
        }));
        setSuccess(true);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again later.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col bg-[#09090B] px-4 py-8 rounded-md">
      {success && <SuccessAlert success={success} path={"Profile"} />}
      {isLoading && <ActionLoader action={"Updating..."} />}

      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Update Details</h2>
        <CardDescription>
          Change the field you want to update and click Update
        </CardDescription>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormDescription>Your Username</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormDescription>Your Fullname</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default UpdateUserForm;
