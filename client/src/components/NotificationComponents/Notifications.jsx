import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { IoRefreshCircleOutline } from "react-icons/io5";
import { UserContext } from "../../context/userContext";

import SendingLoader from "../Loaders/SendingLoader";
import FriendNotification from "./FriendNotification";
import NoteNotification from "./NoteNotification";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import ActionLoader from "../Loaders/ActionLoader";

function Notifications() {
  const { user, setUser } = useContext(UserContext);
  const [friendNotifications, setFriendNotifications] = useState([]);
  const [postNotifications, setPostNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null); 
    
    try {
      const token = extractTokenFromCookie();
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_GET_NOTIFICATIONS_URL,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { userNotifications, postNotifications } = response.data;
        setFriendNotifications(userNotifications);
        setPostNotifications(postNotifications);
        setUser((prevUser) => ({
          ...prevUser,
          notifications: {
            userNotifications,
            postNotifications,
          },
        }));
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.notifications) {
      fetchNotifications();
    } else {
      setFriendNotifications(user.notifications.userNotifications);
      setPostNotifications(user.notifications.postNotifications);
    }
  }, [user?.notifications]);

  const handleRefresh = () => {
    fetchNotifications();
  };

  return (
    <Tabs
      defaultValue="friends"
      className="w-full mt-4 h-[calc(100%-3rem)] flex flex-col scrollHidden"
    >
      <div className="flex justify-between items-center h-[40px] mb-4">
        <TabsList>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="post">Post</TabsTrigger>
        </TabsList>
        <div>
          {loading ? (
            <SendingLoader />
          ) : (
            <button onClick={handleRefresh}>
              <IoRefreshCircleOutline className="text-3xl" />
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100%-40px)] relative overflow-y-scroll w-full pr-2">
        {loading && <ActionLoader action={"Getting Notifications.."} />}
        {error && <div className="text-center font-bold text-red-500 absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y/2">{error}</div>}
        <TabsContent value="friends">
          {friendNotifications.map((notification, index) => (
            <FriendNotification key={index} notification={notification} />
          ))}
        </TabsContent>
        <TabsContent value="post">
          {postNotifications.map((notification, index) => (
            <NoteNotification key={index} notification={notification} />
          ))}
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Notifications;
