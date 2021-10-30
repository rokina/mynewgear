import { Backdrop, Button, Fade, Modal, TextField } from "@material-ui/core";
import firebase from "firebase/app";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db, storage } from "../firebase";

const TweetInput: React.FC<{
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ openModal, setOpenModal }) => {
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
      // TODO: react-image-file-resizerでアップロード前にリサイズwebp化
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
                userID: user.uid,
                likeCount: 0,
                likedUser: [],
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
        userID: user.uid,
        likeCount: 0,
        likedUser: [],
      });
    }
    setTweetImage(null);
    setCategory("");
    setTweetMsg("");
    setBrandName("");
    setGearName("");
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Modal
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="backdrop-blur-[20px] mr-[15px] lg:mr-0"
      >
        <Fade in={openModal}>
          <div className="relative bg-white border rounded-2xl py-[40px] px-[40px] flex items-center justify-center w-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[90%]">
            <form onSubmit={sendTweet}>
              <Button type="button" variant="contained" color="primary">
                <label className="text-white cursor-pointer">
                  <input
                    type="file"
                    className="opacity-0 hidden absolute appearance-none"
                    onChange={onChangeImageHandler}
                  />
                  画像アップロード
                </label>
              </Button>
              {/* <FormControl fullWidth>
                <InputLabel id="category-label">Age</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={category}
                  label="カテゴリ"
                  onChange={setCategory(e.target.value)}
                >
                  <MenuItem value={"10"}>Ten</MenuItem>
                  <MenuItem value={"20"}>Twenty</MenuItem>
                  <MenuItem value={"30"}>Thirty</MenuItem>
                </Select>
              </FormControl> */}
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
              <div className="text-center mt-[10px]">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!tweetImage}
                >
                  <span className={tweetImage ? "text-white" : "text-gray"}>
                    my new gear を投稿
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default TweetInput;
