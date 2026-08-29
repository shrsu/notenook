import { useEffect, useContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import { fetchNotes } from "../redux/notes/notesSlice";
import { fetchPostedNotes } from "../redux/notes/postedNotesSlice";
import { fetchSavedNotes } from "../redux/notes/savedNotesSlice";

import { UserContext } from "../context/userContext";
import { DeviceWidthProvider } from "../context/deviceWidthContext";
import { ChatProvider } from "../context/chatContext";

import Header from "../components/HeaderComponents/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./NoteNookPages/DashBoard";
import SearchNotesPage from "./NoteNookPages/SearchNotesPage";
import SearchUsersPage from "./NoteNookPages/SearchUsersPage";
import MyNotesPage from "./NoteNookPages/MyNotesPage";
import ViewNotePage from "./NoteNookPages/ViewNotePage";
import UserProfilePage from "./NoteNookPages/UserProfilePage";
import EditUserDetailsPage from "./NoteNookPages/EditUserDetailsPage";
import NotificationsPage from "./NoteNookPages/NotificationsPage";
import ViewUserPage from "./NoteNookPages/ViewUserPage";
import ChatPage from "./NoteNookPages/ChatPage";
import Loader from "../components/Loaders/Loader";
import PhoneNavBar from "../components/PhoneNavBar";
import AiChat from "../components/AIChatComponents/AiChat";

import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

function NoteNook() {
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const [isAiChatVisible, setIsAiChatVisible] = useState(false);

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async (token) => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_USER_DETAIL_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          handleSessionExpiration();
        }
      } finally {
        setIsFetchingUserData(false);
      }
    };

    const handleSessionExpiration = () => {
      alert("Session expired, please login again!!");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchData(token);
      dispatch(fetchNotes(token));
      dispatch(fetchPostedNotes(token));
      dispatch(fetchSavedNotes(token));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen w-screen">
      {isFetchingUserData && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-[#09090b]">
          <Loader action={"Loading Data..."} />
        </div>
      )}
      <NavBar
        setIsAiChatVisible={setIsAiChatVisible}
        isAiChatVisible={isAiChatVisible}
      />
      <PhoneNavBar
        setIsAiChatVisible={setIsAiChatVisible}
        isAiChatVisible={isAiChatVisible}
      />
      <Header />
      <div className="noteNook css fixed top-24 overflow-y-scroll left-24 rounded-tl-md bg-muted/5 p-4">
        <div
          className={`absolute z-[100] top-8 left-4 h-[calc(100%-4rem)] transition-transform duration-300 ${
            isAiChatVisible ? "scale-100" : "scale-0"
          }`}
        >
          <AiChat setIsAiChatVisible={setIsAiChatVisible} />
        </div>
        <DeviceWidthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/friends" element={<SearchUsersPage />} />
              <Route path="/chatPage/*" element={<ChatPage />} />
              <Route path="/notes" element={<SearchNotesPage />} />
              <Route path="/myNotes/*" element={<MyNotesPage />} />
              <Route path="/profile/*" element={<UserProfilePage />} />
              <Route path="/profile/edit" element={<EditUserDetailsPage />} />
              <Route path="/viewUser/:userId" element={<ViewUserPage />} />
              <Route path="/viewNote/:documentId" element={<ViewNotePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </ChatProvider>
        </DeviceWidthProvider>
      </div>
    </div>
  );
}

export default NoteNook;
