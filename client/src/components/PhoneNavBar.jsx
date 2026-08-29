import { useState } from "react";
import { MdAssistantNavigation, MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { FaNoteSticky } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";

import aiChatHead from "../assets/AiChatHead.png";

const getClassNames = (isActive, baseClasses, activeClasses, hoverClasses) => {
  return `${baseClasses} ${hoverClasses} ${isActive ? activeClasses : ""}`;
};

function PhoneNavBar({ isAiChatVisible, setIsAiChatVisible }) {
  const [expand, setExpand] = useState(false);

  return (
    <div className="phoneNavBar fixed bottom-0 left-0 flex-col z-10 w-[50px]">
      <div
        className={`w-[50px] h-[50px] bg-primary ml-2 mb-2 p-1.5 shadow-xl cursor-pointer rounded-full transition-transform duration-300 ${
          expand ? "rotate-180" : ""
        }`}
        onClick={() => setExpand(!expand)}
      >
        <MdAssistantNavigation className="w-full h-full text-white" />
      </div>
      <div
        className={`w-screen flex items-center transition-all duration-300 bg-[#09090b] ${
          expand ? "h-14 opacity-100" : "h-0 opacity-0"
        } overflow-hidden backdrop-blur-md shadow-lg`}
      >
        <div className="flex w-screen items-center justify-around">
          <NavLink
            to="/notenook/dashboard"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton flex items-center justify-center p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 border-[#F1C40F] bg-[#3c310b]",
                "scale-110 text-[#F1C40F]",
                "hover:scale-110"
              )
            }
          >
            <MdDashboard className="text-xl" />
          </NavLink>

          <NavLink
            to="/notenook/notes"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton flex items-center justify-center p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 border-[#E67E22] bg-[#3c310b]",
                "scale-110 text-[#E67E22]",
                "hover:scale-110"
              )
            }
          >
            <FaSearch className="text-xl" />
          </NavLink>

          <NavLink
            to="/notenook/myNotes"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton flex items-center justify-center p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 border-[#2ECC71] bg-[#3c310b]",
                "scale-110 text-[#2ECC71]",
                "hover:scale-110"
              )
            }
          >
            <FaNoteSticky className="text-xl" />
          </NavLink>

          <NavLink
            to="/notenook/friends"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton flex items-center justify-center p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 border-[#3498DB] bg-[#3c310b]",
                "scale-110 text-[#3498DB]",
                "hover:scale-110"
              )
            }
          >
            <FaUserFriends className="text-xl" />
          </NavLink>

          <NavLink
            to="/notenook/chatPage"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton flex items-center justify-center p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 border-[#9B59B6] bg-[#3c310b]",
                "scale-110 text-[#9B59B6]",
                "hover:scale-110"
              )
            }
          >
            <IoChatbubbles className="text-xl" />
          </NavLink>
          <div
            className="h-12 w-12 z-[100] rounded-[50%] cursor-pointer"
            style={{
              backgroundImage: `url(${aiChatHead})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => {
              setIsAiChatVisible(!isAiChatVisible);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneNavBar;
