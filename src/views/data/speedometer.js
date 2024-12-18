import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

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
    fontSize: "0px",
    color: "#000"
  }
};

const Speedometer = ({ id, value, title }) => {
  return (
    <div style={styles.dial}>
      <ReactSpeedometer
        maxValue={10}
        minValue={-0}
        height={60}
        width={100}
        value={value}
        needleTransition="easeQuadIn"
        needleTransitionDuration={1000}
        needleColor="red"
        startColor="green"
        segments={10}
        endColor="blue"
      />
      <div style={styles.title}>{title}</div>
    </div>
  );
};

export default Speedometer;
