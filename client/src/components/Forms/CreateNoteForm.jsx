import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import { useDispatch } from "react-redux";
import { addNote } from "../../redux/notes/notesSlice";
const formSchema = z.object({
  title: z.string().min(1, { message: "Enter note title" }),
  subject: z.string().min(1, { message: "Enter note subject" }),
});

function CreateNoteForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
    },
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const token = extractTokenFromCookie();

      if (token) {
        const response = await axios.post(
          import.meta.env.VITE_REACT_APP_NEW_NOTE_URL,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const newNote = response.data.note;
        dispatch(addNote(newNote));
        navigate(`/notenook/myNotes/writeNote/${response.data.note._id}`);
      } else {
        setErrorMessage("Token cookie not found.");
      }
    } catch (err) {
      setErrorMessage("Failed to create note. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col">
      {isLoading && <ActionLoader action={"Creating note..."} />}
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Create a Note</h2>
        <CardDescription>Enter the note title and subject</CardDescription>
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormDescription>Enter the note title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Subject</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-black" />
                  </FormControl>
                  <FormDescription>Enter the subject.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Note
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}

export default CreateNoteForm;
