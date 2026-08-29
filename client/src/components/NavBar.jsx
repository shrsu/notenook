import { NavLink } from "react-router-dom";

import { MdDashboard } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import aiChatHead from "../assets/AiChatHead.png";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getClassNames = (isActive, baseClasses, activeClasses, hoverClasses) => {
  return `${baseClasses} ${hoverClasses} ${isActive ? activeClasses : ""}`;
};

const NavBar = ({ isAiChatVisible, setIsAiChatVisible }) => {
  return (
    <TooltipProvider>
      <div className="navBar flex bg-[#09090b] css absolute bottom-0 w-screen justify-center items-center p-2 z-10 md:h-auto">
        <div className="navButtons css flex w-full flex-row justify-evenly items-center">
          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>My Notes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>Friends</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>Chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>Ai Assistant</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NavBar;
