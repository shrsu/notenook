import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";

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
import { Card } from "../ui/card";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import PDFUploader from "./PDFUploader";
import ErrorAlert from "./ErrorAlert";
import ActionLoader from "../Loaders/ActionLoader";

import { useDispatch } from "react-redux";
import { updateUpdatedNote } from "../../redux/notes/notesSlice";
import {
  addPostedNote,
  removeDeletedPostedNote,
  updateUpdatedPostedNote,
} from "../../redux/notes/postedNotesSlice";
const formSchema = z.object({
  title: z.string().min(3, { message: "Enter title." }),
  subject: z.string().min(3, { message: "Enter subject" }),
});

function NoteDetailsForm({ note, setNote }) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const { documentId } = useParams();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note.title,
      subject: note.subject,
    },
  });

  useEffect(() => {
    if (note.fileReference) {
      setFileName(note.fileReference.fileName);
      setFileUrl(note.fileReference.url);
    }
  }, [note]);

  const handleFormSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const formData = {
        noteId: documentId,
        title: data.title,
        subject: data.subject,
      };

      const token = extractTokenFromCookie();
      if (token) {
        await axios.patch(
          import.meta.env.VITE_REACT_APP_UPDATE_NOTE_ENDPOINT,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(
          updateUpdatedNote({
            ...formData,
          })
        );
        dispatch(
          updateUpdatedPostedNote({
            ...formData,
          })
        );
      }
    } catch (error) {
      setError("Error submitting note details");
      setShowError(true);
      console.error("Error submitting note details:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const postNote = async () => {
    const token = extractTokenFromCookie();
    if (!token || !note) {
      return;
    }
    setIsPosting(true);
    try {
      const formData = {
        noteId: documentId,
        title: note.title,
        subject: note.subject,
      };

      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_POST_NOTE_ENDPOINT,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setNote({ ...note, postedNote: true });
        dispatch(addPostedNote(response.data.postedNote));
      }
    } catch (error) {
      setError("Error posting note");
      setShowError(true);
      console.error("Error posting note:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const deletePostedNote = async () => {
    const token = extractTokenFromCookie();
    if (!token || !note) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_DELETE_POSTEDNOTE_ENDPOINT
        }/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        setNote({ ...note, postedNote: false });
        dispatch(removeDeletedPostedNote(note._id));
      }
    } catch (error) {
      setError("Error deleting posted note");
      setShowError(true);
      console.error("Error deleting posted note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-[#0C0A09] text-white border-neutral-600 border-[0.25px] w-[500px] max-w-[100%] m-auto p-4 flex flex-col gap-6 items-center relative">
      <div className="flex w-[90%] flex-col justify-around postDiv gap-4 mt-4">
        <p className="font-bold">
          Upload the note so that everyone can view it
        </p>
        <div className="self-end">
          {note?.postedNote ? (
            <Button variant="destructive" onClick={deletePostedNote}>
              Unpost
            </Button>
          ) : (
            <Button onClick={postNote} variant="secondary">
              Post{" "}
            </Button>
          )}
        </div>
      </div>
      <div className="w-[90%]">
        <p className="font-bold">Upload Pdf</p>
        <PDFUploader
          documentId={documentId}
          fileName={fileName}
          setFileName={setFileName}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6 w-[90%] flex flex-col"
        >
          <p className="font-bold">Update Note Details</p>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} className="text-black" />
                </FormControl>
                <FormDescription>Your Note Title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} className="text-black" />
                </FormControl>
                <FormDescription>Your Note Subject.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="self-end">Update details</Button>
        </form>
      </Form>

      {isUpdating && <ActionLoader action={"Updating note..."} />}
      {isPosting && <ActionLoader action={"Posting note..."} />}
      {isDeleting && <ActionLoader action={"Deleting posted note..."} />}

      <ErrorAlert
        error={error}
        showError={showError}
        setError={setError}
        setShowError={setShowError}
      />
    </Card>
  );
}

export default NoteDetailsForm;
