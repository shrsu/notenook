import React, { useEffect } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "../ui/card";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaRegStickyNote, FaRegEdit } from "react-icons/fa";

import { CgProfile } from "react-icons/cg";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";

function AboutSection() {
  const features = [
    {
      title: "Post Notes",
      description:
        "Easily upload and share your notes, making learning a collaborative effort.",
      icon: <FaRegStickyNote />,
    },
    {
      title: "Profile Viewing",
      description:
        "Explore profiles of other students, connect with peers who share similar interests.",
      icon: <CgProfile />,
    },
    {
      title: "Connect and Follow",
      description:
        "Build a network of learning buddies by staying connected and following other users.",
      icon: <LiaUserFriendsSolid />,
    },
    {
      title: "Real-Time Chat",
      description:
        "Discuss topics and collaborate on projects through real-time chat functionality.",
      icon: <IoChatbubbleOutline />,
    },
    {
      title: "Text Editor",
      description:
        "Create and format notes effortlessly using our intuitive text editor powered by Quill.",
      icon: <FaRegEdit />,
    },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col items-center justify-center px-8 mt-44 xl:mt-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About Note Nook</h1>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="flex flex-wrap justify-center gap-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="max-w-xs p-4 shadow-lg"
          >
            <Card className="text-center bg-[#0C0A09]">
              <CardHeader className="flex flex-col items-center">
                <div className="text-4xl mb-4 text-white">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default AboutSection;
