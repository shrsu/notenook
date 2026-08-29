import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FriendsList from "./FriendsList";
import UserPostedNoteList from "../NoteLists/ViewUserPostedNoteList";

function ViewUserProfileContent({ userInfo }) {
  return (
    <Tabs defaultValue="notes" className="w-full flex flex-col mt-4">
      <TabsList
        style={{
          backgroundColor: "#09090b",
          alignSelf: "flex-start",
          width: "100%",
          justifyContent: "start",
        }}
      >
        <TabsTrigger value="notes">Posted Notes</TabsTrigger>
        <TabsTrigger value="friends">Friends</TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <UserPostedNoteList postedNotes={userInfo?.postedNotes} />
      </TabsContent>
      <TabsContent value="friends">
        <FriendsList friends={userInfo?.friends} />
      </TabsContent>
    </Tabs>
  );
}

export default ViewUserProfileContent;
