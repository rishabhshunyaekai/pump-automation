import React from "react";
import GaugeChart from "react-gauge-chart";

const styles = {
  dial: {
    display: "inline-block",
    width: `100px`,
    height: `auto`,
    color: "#000",
    padding: "2px"
  },
  title: {
    fontSize: "0px",
    color: "red"
  }
};

const Dial = ({ id, value, title }) => {
  let percent = value / 100;

  return (
    <div style={styles.dial}>
      <GaugeChart
        id={id}
        nrOfLevels={30}
        // colors={["#FFC371", "#FF5F6D"]}
        colors={["#FFC371", "#FF5F6D"]}
        arcWidth={0.2}
        textColor={"grey"}
        fontSize={"20px"}
        paddingTop={"20px"}
        formatTextValue={(value) => value}
        percent={percent}
      />
      <div style={styles.title}>{title}</div>
    </div>
  );
};

export default Dial;
