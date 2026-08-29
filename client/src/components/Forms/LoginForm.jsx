import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

import { UserContext } from "../../context/userContext";
import SuccessAlert from "../SuccessAlert";
import ActionLoader from "../Loaders/ActionLoader";
import googleLogo from "../../assets/googleLogo.svg";

const formSchema = z.object({
  username: z.string().min(1, { message: "Enter username or email" }),
  password: z.string().min(1, { message: "Enter Password" }),
});

function LoginForm({ setUserData }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const { setUser, setIsUserLoggedIn } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_USER_LOGIN_URL,
        data
      );

      document.cookie = `token=${res.data.token}; path=/`;
      setUser(res.data.user);
      setIsUserLoggedIn(true);
      setSuccess(true);
    } catch (error) {
      if (error.response?.status === 403) {
        setUserData(error.response.data);
        navigate("/forms/verification");
      }

      const errorMessages = {
        404: "User not found. Please check your credentials.",
        500: "Server error. Please try again later.",
        401: "Invalid credentials. Please try again.",
        default: "An unexpected error occurred. Please try again.",
      };

      setErrorMessage(
        error.response
          ? errorMessages[error.response.status] || errorMessages.default
          : "Network error. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URI;
  };

  return (
    <div className="relative flex flex-col">
      <SuccessAlert success={success} path={"Dashboard"} />
      {isLoading && <ActionLoader action={"Logging in..."} />}
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Login</h2>
        <CardDescription>Sign in to your account</CardDescription>
        {errorMessage && (
          <h2 className="text-lg font-bold text-red-500">{errorMessage}</h2>
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
                  <FormDescription>
                    Enter your username or email.
                  </FormDescription>
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
                    <Input {...field} type="password" className="text-black" />
                  </FormControl>
                  <FormDescription>Enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
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
                <span>Sign in with Google</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="self-center">
        Don't have an account?{" "}
        <Button variant="link">
          <Link to="/forms/registration">
            <span>Register</span>
          </Link>
        </Button>
      </CardFooter>
    </div>
  );
}

export default LoginForm;
