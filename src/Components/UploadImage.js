import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../firebase/config";
import styles from "../screens/combinedStyles";

if (process.env.NODE_ENV !== "production") require("../../secrets");

const checkForLibraryPermission = async () => {
  const {
    libraryPermission,
  } = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (libraryPermission !== "granted") {
    alert("Please grant permission for this app to access your media library");
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  } else {
    console.log("Media permissions are granted");
  }
};

const checkForCameraPermission = async () => {
  const { cameraPermission } = await ImagePicker.getCameraPermissionsAsync();
  if (cameraPermission !== "granted") {
    alert("Please grant permission for this app to access your camera");
    await ImagePicker.requestCameraPermissionsAsync();
  } else {
    console.log("Camera permissions are granted");
  }
};

export default function UploadImage(props) {
  let CLOUDINARY_URL = process.env.CLOUDINARY_URL;

  const user = props.user;
  const pet = props.pet;
  const functionType = props.functionType;
  let img = props.user || props.pet;
  img = img.image;
  const [image, setImage] = useState(img);
  let userImageRef;
  let petImageRef;

  if (functionType === "userImg") {
    userImageRef = firebase.firestore().collection("users").doc(user.id);
  } else if (functionType === "petImg") {
    petImageRef = firebase.firestore().collection("pets").doc(pet.id);
  }

  let _image = "";

  const addImageFromLibrary = async () => {
    checkForLibraryPermission();
    _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (_image.cancelled === true) {
      return;
    }
    uploadToCloud(_image);
  };

  const captureImageFromCamera = async () => {
    checkForCameraPermission();
    let _image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (_image.cancelled === true) {
      return;
    }
    uploadToCloud(_image);
  };

  const uploadToCloud = async (_image) => {
    let base64Img = `data:image/jpg;base64,${_image.base64}`;

    let data = {
      file: base64Img,
      upload_preset: "d93plb6p",
    };

    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }).then(async (r) => {
      let data = await r.json();
      setImage(data.url);
      if (functionType === "userImg") {
        return userImageRef
          .update({
            image: data.url,
          })
          .then(() => {
            console.log("Image successfully updated!");
          })
          .catch((error) => {
            console.error("error updating document: ", error);
          });
      } else if (functionType === "petImg") {
        return petImageRef
          .update({
            image: data.url,
          })
          .then(() => {
            console.log("Image successfully updated!");
          })
          .catch((error) => {
            console.error("error updating document: ", error);
          });
      }
    });
  };

  return (
    <View style={styles.photoContainer}>
      {image && (
        <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
      )}
      <View style={styles.cameraBtnContainer}>
        <TouchableOpacity
          onPress={captureImageFromCamera}
          style={styles.uploadBtn}
        >
          <Text>{image ? "Take new photo from" : "Upload from"} Camera</Text>
          <AntDesign name="camerao" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImageFromLibrary}
          style={styles.uploadBtn}
        >
          <Text>{image ? "Edit" : "Upload"} Image</Text>
          <AntDesign name="clouduploado" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
