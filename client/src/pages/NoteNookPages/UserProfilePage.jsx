import { useState, useEffect } from "react";

import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserInfo from "../../components/UserProfileComponents/UserInfo";

import MyNoteList from "../../components/NoteLists/MyNoteList";
import MyPostedNotesList from "../../components/NoteLists/MyPostedNotesList";
import FriendsList from "../../components/UserProfileComponents/FriendsList";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function UserProfilePage() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = extractTokenFromCookie();
      if (!token) {
        throw new Error("Token not found");
      }
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_MYPROFILE_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="userProfilePage page lg:w-[900px] max-w-[90vw] m-auto">
      <UserInfo userInfo={userInfo} />

      <Tabs defaultValue="notes" className="w-full flex flex-col mt-4">
        <TabsList
          style={{
            backgroundColor: "#09090b",
            alignSelf: "flex-start",
            width: "100%",
            justifyContent: "start",
          }}
        >
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <MyNoteList notes={userInfo?.notes} />
        </TabsContent>
        <TabsContent value="posted">
          <MyPostedNotesList
            postedNotes={userInfo?.postedNotes}
            isMyProfile={true}
          />
        </TabsContent>
        <TabsContent value="friends">
          <FriendsList friends={userInfo?.friends} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserProfilePage;
