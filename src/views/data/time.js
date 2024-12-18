import React from "react";

const styles = {
  dial: {
    display: "inline-block",
    width: `150px`,
    height: `auto`,
    color: "#000",
    border: "0.5px solid #fff",
    padding: "2px"
  },
  title: {
    fontSize: "1em",
    color: "#000",
    marginTop: "15px"
  }
};

const Time = ({ id, value, title }) => {
  return <div style={styles.dial}></div>;
};

export default Time;
