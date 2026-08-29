import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      setError("No token found.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_GETCHATS_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.users);
        setFriends(response.data.friends);
        setLoading(false);
      } catch (error) {
        setError("Error fetching users for chat.");
        console.error("Error fetching users for chat:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ChatContext.Provider value={{ users, friends, error, loading, setUsers }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
