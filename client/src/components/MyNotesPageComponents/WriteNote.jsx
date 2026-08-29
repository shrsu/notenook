import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TextEditor from "./TextEditor";
import NoteDetailsForm from "./NoteDetailsForm";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const WriteNote = () => {
  const [note, setNote] = useState(null);
  const { documentId } = useParams();

  useEffect(() => {
    const fetchDefaultValues = async () => {
      const token = extractTokenFromCookie();
      try {
        if (token) {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_GET_USER_NOTE_ENDPOINT
            }?documentId=${documentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const note = response.data.note;
          setNote(note);
        }
      } catch (error) {
        console.error("Error fetching default values:", error);
      }
    };

    fetchDefaultValues();
  }, []);

  return (
    <Tabs
      defaultValue="edit"
      className="lg:w-[1000px] max-w-[95vw] m-auto flex flex-col "
    >
      <div className="mb-2 px-6">
        <div className="text-xl font-semibold">
          <span className="text-yellow-500 font-extrabold">Title: </span>
          <span>{note?.title}</span>
        </div>
        <div className="text-lg font-semibold">
          <span className="text-yellow-500 font-extrabold">Subject: </span>
          <span>{note?.subject}</span>
        </div>
      </div>
      <TabsList
        style={{
          backgroundColor: "#09090b",
          alignSelf: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="post">Post</TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <TextEditor />
      </TabsContent>
      <TabsContent value="post">
        <div className="pb-[50px]">
          <NoteDetailsForm note={note} setNote={setNote} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default WriteNote;
