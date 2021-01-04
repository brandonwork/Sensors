import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { LineChart } from "react-native-chart-kit";

const SensorCard = (props) => {
  let sensorReadingObj = [];
  let labels = [];
  const [sensorQuality, setQuality] = useState(null);
  const [sensorInfo1, setSensorInfo] = useState(null);
  const [sensorInfo2, setSensorInfo2] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let getSensorDataObj = (data) => {
      let readingValues = [];
      for (let i = 0; i < data.length; i++) {
        if (!isNaN(Number(data[i]))) {
          readingValues.push(Number(data[i]));
        }
      }
      return readingValues;
    };
    let getLables = (obj) => {
      let lineGraphLables = [];
      for (let i = 0; i < obj.length; i++) {
        lineGraphLables.push(i + 1);
      }

      return lineGraphLables;
    };
    labels = getLables(sensorReadingObj);
    sensorReadingObj = getSensorDataObj(props.props);
    let sumArr = 0;
    for (let j = 0; j < sensorReadingObj.length; j++) {
      sumArr += sensorReadingObj[j];
    }
    let avg = Number(sumArr) / sensorReadingObj.length;
    switch (props.sensorType) {
      case "thermometer":
        let sdSum = 0;
        for (let x = 0; x < sensorReadingObj.length; x++) {
          sdSum += (sensorReadingObj[x] - avg) ** 2;
        }
        let sdTempValue = Math.sqrt(
          Number(sdSum) / Number(sensorReadingObj.length)
        );
        let sensorAvgDiff = avg - props.constants.temp;
        if (sensorAvgDiff < 0) {
          sensorAvgDiff = -sensorAvgDiff;
        }
        if (
          sdTempValue < props.rules.tempUPSD &&
          sensorAvgDiff <= props.rules.tempUPAccu
        ) {
          setQuality("Ultra Precise");
        } else if (
          sdTempValue < props.rules.tempVPSD &&
          -props.rules.tempVPAccu <=
            avg - props.constants.temp <=
            props.rules.tempVPAccu
        ) {
          setQuality("Very Precise");
        } else {
          setQuality("Precise");
        }
        setSensorInfo(`Standard Deviation: ${sdTempValue}`);
        setSensorInfo2(`Sensor Average Difference: ${sensorAvgDiff}`);
        break;
      case "humidity":
        let numOfOverReadings = 0;
        for (let x = 0; x < sensorReadingObj.length; x++) {
          let sensorDiff = sensorReadingObj[x] - props.constants.humidity;
          if (sensorDiff < 0) {
            sensorDiff = -sensorDiff;
          }
          if (sensorDiff > props.rules.humidityKeepDiff) {
            numOfOverReadings += 1;
          }
        }
        if (numOfOverReadings > 0) {
          setQuality("Discard");
        } else {
          setQuality("Keep");
        }
        setSensorInfo(
          `Number of readings with more than 1% difference: ${numOfOverReadings}`
        );
        break;
      case "monoxide":
        let numOfOverReadingsMono = 0;
        for (let x = 0; x < sensorReadingObj.length; x++) {
          let sensorDiff = sensorReadingObj[x] - props.constants.monoxide;
          if (sensorDiff < -3 || sensorDiff > 3) {
            numOfOverReadingsMono += 1;
          }
        }
        if (numOfOverReadingsMono > 0) {
          setQuality("Discard");
        } else {
          setQuality("Keep");
        }
        setSensorInfo(
          `Number of readings with more then 3 ppm difference: ${numOfOverReadingsMono}`
        );
        break;
    }
    setLoading(false);
  }, []);

  const loadCards = () => {
    let data = props.props;
    let readingValues = [];
    for (let i = 0; i < data.length; i++) {
      if (!isNaN(Number(data[i]))) {
        readingValues.push(Number(data[i]));
      }
    }
    let graphYSuffix;

    switch (data[0]) {
      case "thermometer":
        graphYSuffix = " F";
        break;
      case "humidity":
        graphYSuffix = "%";
        break;
      case "monoxide":
        graphYSuffix = "ppm";
        break;
      default:
        break;
    }
    return (
      <View>
        <Text>Type: {props.props[0]}</Text>
        <Text>Name: {props.props[1]}</Text>
        <Text>Quality: {sensorQuality}</Text>
        <Text>{sensorInfo1}</Text>
        <Text>{sensorInfo2}</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: readingValues,
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={150}
          yAxisLabel=""
          yAxisSuffix={graphYSuffix}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#2b72ff",
            backgroundGradientFrom: "#2b72ff",
            backgroundGradientTo: "#2b72ff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 1,
              paddingLeft: 0,
            },
            propsForDots: {
              r: "3",
              strokeWidth: "0",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 5,
            borderRadius: 5,
          }}
        />
      </View>
    );
  };
  return (
    <View
      style={{
        width: windowWidth,
        backgroundColor: "white",
        opacity: 1,
        borderBottomWidth: 1,
        borderColor: "grey",
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 10,
        marginBottom: 5,
      }}
    >
      {isLoading ? <Text>Loading</Text> : loadCards()}
    </View>
  );
};
export default SensorCard;
