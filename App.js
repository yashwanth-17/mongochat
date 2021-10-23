import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chatting, setChatting] = useState(false);
  const [msgs, setMsgs] = useState([]);
  let interval;

  useEffect(() => {
    if (name !== "") {
      setChatting(true);
    }
  }, []);

  useEffect(() => {
    if (name !== "" && chatting) {
      interval = setInterval(() => {
        getMsgs();
      }, 2500);
    }

    return () => clearInterval(interval);
  }, [name, chatting]);

  async function getMsgs() {
    const data = (await axios.get("http://192.168.100.19:4000/")).data;
    console.log("msgs", data);
    setMsgs(data);
  }

  async function sendMsg() {
    if (message !== "") {
      const data = (
        await axios.post("http://192.168.100.19:4000/", { name, message })
      ).data;
      console.log("msgs", data);
      setMessage("");
      // setMsgs(data);
    }
  }

  return (
    <View style={styles.container}>
      {chatting ? (
        <>
          <View style={{ marginTop: 20, flexDirection: "row" }}>
            <Text style={{ fontSize: 16, flex: 1 }}>Username: {name}</Text>
            <Text
              style={{ fontSize: 16, color: "red" }}
              onPress={() => {
                setName("");
                setChatting(false);
              }}
            >
              Leave Chat
            </Text>
          </View>
          <ScrollView style={{ flex: 1, marginTop: 8 }}>
            {msgs.map((msg) => (
              <Message key={msg._id} msg={msg} />
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(value) => setMessage(value)}
              value={message}
              placeholder="Enter your message"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "lightgrey",
                height: 50,
                borderRadius: 12,
                fontSize: 16,
                paddingLeft: 12,
                marginBottom: 12,
                marginRight: 8,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "dodgerblue",
                width: 70,
                height: 50,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }} onPress={sendMsg}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 50, marginTop: 20 }}>
            Welcome to Mongochat!
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginTop: 60,
              marginBottom: 12,
            }}
          >
            Enter your name
          </Text>
          <TextInput
            onChangeText={(value) => setName(value)}
            placeholder="name"
            style={{
              borderWidth: 1,
              borderColor: "lightgrey",
              height: 50,
              borderRadius: 12,
              fontSize: 16,
              paddingLeft: 12,
              marginBottom: 12,
            }}
          />
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              backgroundColor: "dodgerblue",
              width: 120,
              height: 50,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 16, color: "white" }}
              onPress={() => setChatting(true)}
            >
              Start Chatting
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },
});

const Message = ({ msg }) => {
  return (
    <View
      style={{
        backgroundColor: "#eee",
        padding: 8,
        borderRadius: 12,
        marginTop: 4,
      }}
    >
      <Text>{msg.name}</Text>
      <Text style={{ fontSize: 16 }}>{msg.message}</Text>
    </View>
  );
};
