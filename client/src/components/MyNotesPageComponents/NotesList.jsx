import { Link } from "react-router-dom";

import { Button } from "../ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IoCreate } from "react-icons/io5";

import MyNoteList from "../NoteLists/MyNoteList.jsx";
import SavedList from "../NoteLists/SavedList.jsx";
import ReviewList from "../NoteLists/ReviewList.jsx";
import MyPostedNotesList from "../NoteLists/MyPostedNotesList.jsx";

function NotesList() {
  return (
    <Tabs defaultValue="myNotes" className="page">
      <div className="h-32">
        <div className="flex w-full justify-between p-4">
          <h1 className="heading">My Notes</h1>
          <Link to="createNote">
            <Button>
              New Note{" "}
              <span>
                <IoCreate className="text-lg" />
              </span>{" "}
            </Button>
          </Link>
        </div>
        <TabsList style={{ backgroundColor: "#09090b" }}>
          <TabsTrigger value="myNotes">My Notes</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
      </div>
      <div className="h-[calc(100%-8rem)] overflow-y-scroll">
        <TabsContent value="myNotes">
          <MyNoteList />
        </TabsContent>
        <TabsContent value="posted">
          <MyPostedNotesList />
        </TabsContent>
        <TabsContent value="saved">
          <SavedList />
        </TabsContent>
        <TabsContent value="review">
          <ReviewList />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default NotesList;
