import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as Google from "expo-google-app-auth";

// https://www.youtube.com/watch?v=QT0PXhH9uTg
export default function App() {
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "api key android", // https://console.cloud.google.com/apis/credentials?project=capable-range-338408
        iosClientId:
          "api key ios",  // https://console.cloud.google.com/apis/credentials?project=capable-range-338408
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        setAccessToken(result.accessToken);
      } else {
        console.log("Permission denied");
      }
    } catch (error) {
      console.log("signInWithGoogleAsync function error : ", error);
    }
  };

  const getUserData = async () => {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse.json().then((data) => {
      setUserInfo(data);
    });
  };

  const showUserInfo = () => {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{uri : userInfo.picture}} style={styles.profilePic}/>
          <Text>Welcom {userInfo.name}</Text>
          <Text>Welcom {userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      {showUserInfo()}
      <Button
        title={accessToken ? "Get User Data" : "Login"}
        onPress={accessToken ? getUserData : signInWithGoogleAsync}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
