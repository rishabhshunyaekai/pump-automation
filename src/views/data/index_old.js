import React from "react";
import ReactDOM from "react-dom";

import Battery from "./battery";
import Temp from "./Temp";
import Dial from "./dial";
import AccelDial from "./accelDial";
import Speedometer from "./speedometer";
import Barometer from "./barometer";
import Time from "./time";
import  "../real_time_data/Data.css"
// import "./styles.css";

let datum = {
  date: 1597107474849,
  data: {
    pitch: "0",
    roll: "0",
    yaw: "0",
    vgx: "0",
    vgy: "0",
    vgz: "-8",
    templ: "66",
    temph: "69",
    tof: "30",
    h: "20",
    bat: "90",
    baro: "172.62",
    time: "0",
    agx: "-12.00",
    agy: "-8.00",
    agz: "-980.00",
    location: "32.942690,-96.994845"
  },
  type: "toy",
  drone_id: "drone1"
};

function App() {
  const [value, setValue] = React.useState(90);

  return (
    <div className="App">
      <div className="title">Susan's Battery Gauge for </div>
      <Battery percentage={value} />

      <p>Move slider to see battery level change</p>
      <div className="slidecontainer">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          className="slider"
          id="myRange"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>

      <div className="dials">
        <Time id="dial10" value="10" title="Total Flight Time" />
      </div>
      <div className="dials">
        <Barometer id="dial9" value="172.62" title="Barometer" />
      </div>
      <div className="dials">
        <Temp id="dial7" value="68" title="Lowest Temp" />
        <Temp id="dial8" value="80" title="Highest Temp" />
      </div>
      <div className="dials">
        <Speedometer id="dial5" value="-110" title="Acceleration X" />
        <Speedometer id="dial6" value="-9" title="Acceleration Y" />
      </div>
      <div className="dials">
        <Dial id="dial1" value="12" title="Speed X" />
        <Dial id="dial2" value="110" title="Speed Y" />
      </div>
      <div className="dials">
        <AccelDial id="dial3" value="-110" title="Acceleration X" />
        <AccelDial id="dial4" value="-9" title="Acceleration Y" />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
