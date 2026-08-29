import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
import {
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import ActionLoader from "../Loaders/ActionLoader";
import SuccessAlert from "../SuccessAlert";
import googleLogo from "../../assets/googleLogo.svg";

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]{3,30}$/,
        "Can contain only letters, numbers, underscores, and dashes"
      ),
    fullname: z.string().min(1, "Enter Full name"),
    email: z.string().email("Invalid email").min(1, "Enter e-mail"),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegistrationForm({ setUserData }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_USER_REGISTRATION_URL,
        data
      );
      setUserData(res.data);
      setSuccess(true);
    } catch (error) {
      console.log(error)
      const errorMessage =
        error.response?.data.message ||
        "Registration failed. Please try again later.";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URI;
  };

  return (
    <div className="relative flex flex-col">
      <SuccessAlert success={success} path={"OTP verification"} />
      {isLoading && <ActionLoader action={"Registering..."} />}
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Register</h2>
        <CardDescription>Register your account to get Started</CardDescription>
        {errorMessage && (
          <h2 className="text-lg font-bold text-red-500">{errorMessage}</h2>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                  <FormDescription>Choose your username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormDescription>Enter your full name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-black" />
                    </FormControl>
                    <FormDescription>Enter your email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="text-black" />
                  </FormControl>
                  <FormDescription>Enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="text-black" />
                  </FormControl>
                  <FormDescription>Confirm your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:col-span-2">
              Submit
            </Button>
          </form>
        </Form>
        <div className="relative flex items-center justify-center mt-4">
          <hr className="absolute left-0 w-1/3 border-t border-gray-300" />
          <span className="text-gray-300">or</span>
          <hr className="absolute right-0 w-1/3 border-t border-gray-300" />
        </div>
        <div className="flex items-center justify-center mt-4">
          <Button
            variant="ghost"
            className="flex gap-4 py-6"
            onClick={handleGoogleLogin}
          >
            <img src={googleLogo} alt="Google Logo" className="h-10" />
            <span>Continue with Google</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="self-center">
        Don't have an account?{" "}
        <Button variant="link">
          <Link to="/forms/login">
            <span>Login</span>
          </Link>
        </Button>
      </CardFooter>
    </div>
  );
}

export default RegistrationForm;
