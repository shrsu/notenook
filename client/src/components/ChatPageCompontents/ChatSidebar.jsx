import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoIosSearch } from "react-icons/io";

import UserToChat from "./UserToChat";

const ChatSidebar = ({ users, selectedUser, friends, setSelectedUser }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleSearch = () => {
    const filtered = friends.filter((friend) =>
      friend.username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    navigate(`${user._id}`);
  };

  useEffect(() => {
    if (searchInput.length) {
      const filtered = friends.filter((friend) => {
        return friend.username
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchInput]);

  useEffect(() => {
    setFilteredUsers(users);
    if (selectedUser) {
      setFilteredUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) => user._id === selectedUser._id
        );
        if (userIndex === -1) {
          return [selectedUser, ...prevUsers];
        }
        return prevUsers;
      });
    }
  }, [users]);

  useEffect(() => {
    setSearchInput("");
  }, [location]);

  return (
    <div className="bg-[#09090B] p-4 flex flex-col items-center h-full overflow-y-scroll rounded-md w-full">
      <div className="flex w-full max-w-sm items-center space-x-2 min-h-fit h-[5%] mb-4">
        <Input
          type="text"
          placeholder="Search for friends..."
          className="text-black"
          value={searchInput}
          onChange={handleInputChange}
        />
        <Button type="button" variant="secondary" onClick={handleSearch}>
          <IoIosSearch className="text-2xl" />
        </Button>
      </div>

      <div className="w-full pb-[50px]">
        {filteredUsers.map((user) => (
          <UserToChat
            key={user._id}
            user={user}
            isSelected={selectedUser && user._id === selectedUser._id}
            onUserClick={handleUserClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
