import React, { useEffect, useState } from "react";
import { Dimensions, Text } from "react-native";
import moment from "moment";
import { Colors } from "../constants/Colors";

const RelativeTime = ({ time, fsize }) => {
  // Destructure the 'time' prop correctly
  const [relativeTime, setRelativeTime] = useState("");
  const { width } = Dimensions.get("window");

  useEffect(() => {
    // console.log("Received time:", time); // Debug to check the time being passed

    const updateRelativeTime = () => {
      if (time) {
        const formattedTime = moment(time).fromNow();
        // console.log("Formatted relative time:", formattedTime); // Check if Moment is working
        setRelativeTime(formattedTime);
      }
    };

    updateRelativeTime(); // Set initial relative time

    const intervalId = setInterval(updateRelativeTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [time]);

  return (
    <Text
      style={{ fontSize: fsize ? fsize : width * 0.03, color: Colors.mildGrey }}
    >
      {relativeTime || "Time not available"}
      {/* Display fallback if relativeTime is empty */}
    </Text>
  );
};

export default RelativeTime;
