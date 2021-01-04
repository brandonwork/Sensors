import React from "react";
import { View } from "react-native";
import SensorCard from "./homeSensorCard";
import { ScrollView } from "react-native-gesture-handler";

let data = `thermometer temp-1 2007-04-05T22:00 72.4 2007-04-05T22:01 76.0 2007-04-05T22:02 79.1 2007-04-05T22:03 75.6 2007-04-05T22:04 71.2 2007-04-05T22:05 71.4 2007-04-05T22:06 69.2 2007-04-05T22:07 65.2 2007-04-05T22:08 62.8 2007-04-05T22:09 61.4 2007-04-05T22:10 64.0 2007-04-05T22:11 67.5 2007-04-05T22:12 69.4
thermometer temp-2 2007-04-05T22:01 69.5 2007-04-05T22:02 70.1 2007-04-05T22:03 71.3 2007-04-05T22:04 71.5 2007-04-05T22:05 69.8
humidity hum-1 2007-04-05T22:04 45.2 2007-04-05T22:05 45.3 2007-04-05T22:06 45.1
humidity hum-2 2007-04-05T22:04 44.4 2007-04-05T22:05 43.9 2007-04-05T22:06 44.9 2007-04-05T22:07 43.8 2007-04-05T22:08 42.1
monoxide mon-1 2007-04-05T22:04 5 2007-04-05T22:05 7 2007-04-05T22:06 9
monoxide mon-2 2007-04-05T22:04 2 2007-04-05T22:05 4 2007-04-05T22:06 10 2007-04-05T22:07 8 2007-04-05T22:08 6`;
let constants = {
  temp: 70.0,
  monoxide: 6,
  humidity: 45.0,
};
let ruleValues = {
  tempUPAccu: 0.5,
  tempUPSD: 3,
  tempVPAccu: 0.5,
  tempVPSD: 5,
  humidityKeepDiff: 1.0,
  monoxideKeepDiff: 3,
};

const Home = () => {
  let processedData = data.split("\n").map((el) => {
    return el.split(/\s/);
  });
  return (
    <View>
      <ScrollView>
        {processedData.map((card) => {
          return (
            <SensorCard
              key={card[1]}
              sensorType={card[0]}
              sensorName={card[1]}
              props={card}
              constants={constants}
              rules={ruleValues}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Home;
