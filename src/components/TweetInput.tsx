import React, { useState } from "react";
import { storage, db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Button, IconButton } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
// import { Category } from "@material-ui/icons";

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [tweetMsg, setTweetMsg] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gearName, setGearName] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                category: category,
                text: tweetMsg,
                brandName: brandName,
                gearName: gearName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
                likeCount: 0,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        category: category,
        text: tweetMsg,
        brandName: brandName,
        gearName: gearName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
        likeCount: 0,
      });
    }
    setTweetImage(null);
    setCategory("");
    setTweetMsg("");
    setBrandName("");
    setGearName("");
  };
  return (
    <>
      <form onSubmit={sendTweet} className="text-black">
        <p>
          <input
            placeholder="カテゴリ"
            type="text"
            autoFocus
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </p>
        <p>
          <input
            placeholder="ブランド"
            type="text"
            autoFocus
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </p>
        <p>
          <input
            placeholder="機材名"
            type="text"
            autoFocus
            value={gearName}
            onChange={(e) => setGearName(e.target.value)}
          />
        </p>
        <p>
          <input
            placeholder="コメント"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
        </p>
        <IconButton>
          <label>
            <AddAPhotoIcon />
            <input type="file" onChange={onChangeImageHandler} />
          </label>
        </IconButton>
        <Button type="submit" disabled={!tweetImage}>
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
