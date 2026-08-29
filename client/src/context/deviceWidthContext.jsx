import React, { createContext, useState, useEffect } from "react";

const DeviceWidthContext = createContext();

const DeviceWidthProvider = ({ children }) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DeviceWidthContext.Provider value={deviceWidth}>
      {children}
    </DeviceWidthContext.Provider>
  );
};

export { DeviceWidthContext, DeviceWidthProvider };
