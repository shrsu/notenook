import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "../ui/button";

import { IoNotificationsCircleOutline } from "react-icons/io5";

import Notifications from "../NotificationComponents/Notifications";

const HeaderNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleIconClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  const handleSeeAllClick = () => {
    setShowNotifications(false);
    navigate("notifications");
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    setShowNotifications(false);
  }, [location]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <IoNotificationsCircleOutline
          className="text-3xl"
          onClick={handleIconClick}
        />
      </div>

      <div
        className={`fixed top-[5rem] w-[400px] max-w-[85vw] right-4 bg-gray-950 p-4 rounded-md h-[70vh] shadow-2xl ${
          showNotifications ? "block" : "hidden"
        }`}
        ref={notificationsRef}
      >
        <div className="flex w-full h-8 justify-between items-center">
          <h2 className="font-bold text-lg">Notifications</h2>
          <Button
            variant="secondary"
            className="text-xs h-fit"
            onClick={handleSeeAllClick}
          >
            See All
          </Button>
        </div>
        <Notifications />
      </div>
    </div>
  );
};

export default HeaderNotifications;
