import { Route, Routes } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import Chat from "./Chat";

function ChatPageForDesktop({
  users,
  friends,
  selectedUser,
  setSelectedUser,
  topUser,
  setTopUser,
  chatSocket,
}) {
  return (
    <div className="grid grid-cols-[325px_1fr] gap-4 h-full">
      <ChatSidebar
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        topUser={topUser}
        friends={friends}
      />
      <div className="relative">
        <Routes>
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
          <Route path="/*" element={<ChatPlaceHolder />} />
        </Routes>
      </div>
    </div>
  );
}

function ChatPlaceHolder() {
  return (
    <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-lg font-bold text-neutral-300 text-center">
      Select a Chat
    </p>
  );
}

export default ChatPageForDesktop;
