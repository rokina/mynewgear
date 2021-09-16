import {
  Backdrop,
  Button,
  Fade,
  IconButton,
  Modal,
  TextField,
} from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import firebase from "firebase/app";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db, storage } from "../firebase";

function getModalStyle() {
  const width = 90;
  const height = 90;
  const top = 50;
  const left = 50;

  return {
    width: `${width}%`,
    height: `${height}%`,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [tweetMsg, setTweetMsg] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gearName, setGearName] = useState("");
  const [openModal, setOpenModal] = useState(false);

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
                bookmarkCount: 0,
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
        bookmarkCount: 0,
      });
    }
    setTweetImage(null);
    setCategory("");
    setTweetMsg("");
    setBrandName("");
    setGearName("");
  };
  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <div className="text-4xl text-center">
        <p>my new gear...</p>
        <p className="mt-4">あなたの素敵な機材を共有しませんか</p>
        <button
          onClick={handleOpen}
          className="text-xl font-bold border border-white rounded-lg py-2 px-4 mt-6 transition-colors hover:bg-white hover:text-gray-800"
        >
          my new gear を投稿
        </button>
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div
            style={getModalStyle()}
            className="relative bg-black border border-gray-500 rounded-2xl px-12 py-28 flex items-start"
          >
            <form onSubmit={sendTweet}>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="category"
                label="カテゴリ"
                name="category"
                autoComplete="category"
                value={category}
                className="bg-white rounded-lg"
                onChange={(e) => setCategory(e.target.value)}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="brandName"
                label="ブランド"
                name="brandName"
                autoComplete="brandName"
                value={brandName}
                className="bg-white rounded-lg"
                onChange={(e) => setBrandName(e.target.value)}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="gearName"
                label="機材名"
                name="gearName"
                autoComplete="gearName"
                value={gearName}
                className="bg-white rounded-lg"
                onChange={(e) => setGearName(e.target.value)}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="tweetMsg"
                label="コメント"
                name="tweetMsg"
                autoComplete="tweetMsg"
                multiline={true}
                value={tweetMsg}
                className="bg-white rounded-lg"
                onChange={(e) => setTweetMsg(e.target.value)}
              />
              <IconButton>
                <label className="text-white cursor-pointer">
                  <AddAPhotoIcon />
                  <input
                    type="file"
                    className="opacity-0 hidden absolute appearance-none"
                    onChange={onChangeImageHandler}
                  />
                </label>
              </IconButton>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!tweetImage}
              >
                <span className={tweetImage ? "text-white" : "text-gray-400"}>
                  my new gear を投稿
                </span>
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default TweetInput;
