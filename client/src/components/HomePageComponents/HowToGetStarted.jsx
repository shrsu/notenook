import { CardContent, CardTitle, CardHeader } from "../ui/card";
import { SiTheregister } from "react-icons/si";
import { MdDashboard } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { FaComment, FaTableList } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";

import sideImg from "../../assets/sideImg2.svg";

function HowToGetStarted() {
  const steps = [
    {
      icon: <SiTheregister />,
      sn: 1,
      title: "Register",
      description: "Create an account on Note Nook to get started.",
    },
    {
      icon: <MdDashboard />,
      sn: 2,
      title: "Access Dashboard",
      description:
        "Navigate to your dashboard to manage notes, review lists, and chat conversations.",
    },

    {
      icon: <IoCreate />,
      sn: 3,
      title: "Create a Note",
      description:
        "Use the note creation feature to write and format your own notes.",
    },
    {
      icon: <IoSearch />,
      sn: 4,
      title: "Search for Notes",
      description:
        "Explore notes posted by other users using the search functionality.",
    },
    {
      icon: <FaTableList />,
      sn: 5,
      title: "Manage Your Notes",
      description: "Organize and review your own posted notes and saved notes.",
    },
    {
      icon: <FaComment />,
      sn: 6,
      title: "Interact with Others",
      description:
        "Send friend requests, chat with other users, and comment on their notes.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-40 mt-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        How to Get Started
      </h1>
      <div className="flex flex-col min-[1800px]:flex-row items-center justify-center gap-10 w-full">
        <div>
          <motion.div
            className="sideImg2Container max-w-[90vw] rounded-[10%] p-6 relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={sideImg}
              alt="sideImg2"
              className="sideImg2 elative w-[300px] max-w-[70vw] rounded-[10%]"
            />
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-6 flex flex-col items-center w-80"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CardHeader className="flex flex-col items-center mb-4 text-center">
                <div className="text-4xl mb-2 text-yellow-500">{step.icon}</div>
                <CardTitle className="text-2xl font-semibold">
                  {step.sn}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">{step.description}</p>
              </CardContent>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowToGetStarted;
