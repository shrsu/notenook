import { Route, Routes } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import Chat from "./Chat";

function ChatPageForPhones({
  users,
  friends,
  selectedUser,
  setSelectedUser,
  topUser,
  setTopUser,
  chatSocket,
  location,
}) {
  return (
    <Routes location={location}>
      <Route
        path="/"
        element={
          <ChatSidebar
            users={users}
            topUser={topUser}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            friends={friends}
          />
        }
      />
      <Route
        path="/:userToChatId"
        element={
          <Chat
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setTopUser={setTopUser}
            chatSocket={chatSocket}
          />
        }
      />
    </Routes>
  );
}

export default ChatPageForPhones;
