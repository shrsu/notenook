import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../../components/ui/button";

import { FaExternalLinkAlt } from "react-icons/fa";

import WrappedCommentsWindow from "../../components/ViewNotePageComponents/WrappedCommentWindow";
import ViewWindow from "../../components/ViewNotePageComponents/ViewWindow";
import SendingLoader from "../../components/Loaders/SendingLoader";
import ActionLoader from "../../components/Loaders/ActionLoader";

import {
  addSavedNote,
  removeUnsavedNote,
} from "../../redux/notes/savedNotesSlice";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import formatDate from "../../Functions/FormatDate";

function ViewNotePage() {
  const { documentId } = useParams();

  const [note, setNote] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("post");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDefaultValues = async () => {
      try {
        const token = extractTokenFromCookie();
        if (!token || !documentId) return;

        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_VIEW_NOTE_ENDPOINT
          }?documentId=${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { note, isOwner, isSaved } = response.data;
        setNote(note);
        setIsOwner(isOwner);
        setIsSaved(isSaved);
      } catch (error) {
        console.error("Error fetching default values:", error);
        setError("Failed to load note details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultValues();
  }, [documentId]);

  const saveNote = async () => {
    setIsSending(true);
    try {
      const token = extractTokenFromCookie();
      if (!token || !documentId) return;

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SAVE_NOTE_ENDPOINT}/${documentId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setIsSaved(true);
        dispatch(addSavedNote(response.data));
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSending(false);
    }
  };

  const unsaveNote = async () => {
    setIsSending(true);
    try {
      const token = extractTokenFromCookie();
      if (!token || !documentId) return;

      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_DELETE_SAVE_NOTE_ENDPOINT
        }/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsSaved(false);
        dispatch(removeUnsavedNote({ savedNoteId: response.data.savedNoteId }));
      }
    } catch (error) {
      console.error("Error unsaving note:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <ActionLoader action={"Loading note...."} />;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        {error}
      </p>
    );
  }

  return (
    <div className="page xl:w-[1000px] p-2 max-w-[95vw] m-auto relative">
      <div className="p-2 h-[166px]">
        <div className="mb-2">
          <div className="text-xl font-semibold">
            <span className="text-yellow-500 font-extrabold">Title: </span>
            <span>{note.title}</span>
          </div>
          <div className="text-lg font-semibold">
            <span className="text-yellow-500 font-extrabold">Subject: </span>
            <span>{note.subject}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm">
            <span className="text-neutral-400">Posted By: </span>
            <span className="font-bold">{note.postedBy?.username}</span>
          </p>
          <p className="text-xs">
            <span className="text-neutral-400">Posted: </span>
            <span className="font-bold">{formatDate(note.updatedAt)}</span>
          </p>
        </div>
        <div className="w-full flex gap-10 justify-end">
          {isSending ? (
            <div className="w-28 flex justify-center items-center">
              <SendingLoader />
            </div>
          ) : (
            <>
              {!isOwner && !isSaved && (
                <Button onClick={saveNote} className="text-xs h-fit">
                  Save Note
                </Button>
              )}
              {!isOwner && isSaved && (
                <Button
                  onClick={unsaveNote}
                  variant="destructive"
                  className="text-xs h-fit"
                >
                  Unsave Note
                </Button>
              )}
            </>
          )}
          {note.fileReference && (
            <a
              href={note.fileReference.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="text-xs h-fit" variant="secondary">
                PDF <FaExternalLinkAlt className="ml-2" />
              </Button>
            </a>
          )}
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex flex-col mt-4 h-[calc(100%-166px)] min-h-[200px]"
      >
        <TabsList
          style={{
            backgroundColor: "#09090b",
            alignSelf: "flex-start",
          }}
        >
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <ViewWindow note={note} />
        </TabsContent>
        <TabsContent value="comments">
          <WrappedCommentsWindow setTab={setTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ViewNotePage;
