import "./App.css";
import { ButtonSave } from "./components/ButtonSave";
import { useState, useEffect } from "react";
import mqtt from "mqtt";

function App() {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState();
  const [mqttData, setMqttData] = useState();
  const mqttConnect = (host, mqttOption) => {
    setConnectStatus("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };
  useEffect(() => {
    mqttConnect({
      host: "195.161.68.19",
      port: 8888,
      protocol: "ws",
      clientId: "asdg1",
    });
  }, []);

  useEffect(() => {
    // if (connectStatus !== "Connected") {
    //   mqttConnect({
    //     host: "192.168.1.96",
    //     port: 8888,
    //     protocol: "ws",
    //     clientId: "asdg1",
    //   });
    // }
    if (client) {
      console.log(client);
      client.on("connect", () => {
        setConnectStatus("Connected");
        mqttSub({ topic: "test", qos: 1 });
        mqttSub({ topic: "outTopic", qos: 1 });
        console.log("mqtt connect");
        // const { topic, qos, payload } = context;
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        console.log("mqtt reconnect");
        setConnectStatus("Reconnecting");
        // mqttConnect({
        //   host: "192.168.1.96",
        //   port: 1883,
        //   // protocol: "ws",
        //   clientId: "asdg1",
        // });
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log("mqtt message", payload);
        // setPayload(payload);
        console.log("payload", payload);
        setMqttData(message.toString());
      });
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        console.log("mqtt subscribe at", subscription);
        // setIsSub(true);
      });
    }
  };

  const mqttPublish = (context) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  return (
    <div>
      <ButtonSave />
    </div>
  );
}

export default App;
