import {
  Backdrop,
  Button,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@material-ui/core";
import firebase from "firebase/app";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

  const onChangeCategoryHandler = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCategory(e.target.value as string);
  };
  const onChangeBrandNameHandler = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setBrandName(e.target.value as string);
  };

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
              <div className="mb-[5px]">
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
              </div>
              <FormControl fullWidth variant="filled" margin="dense">
                <InputLabel id="category-select-label">カテゴリー</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  label="カテゴリー"
                  onChange={onChangeCategoryHandler}
                  required
                >
                  <MenuItem value={"guitar"}>Guitar</MenuItem>
                  <MenuItem value={"bass"}>Bass</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled" margin="dense">
                <InputLabel id="brandName-select-label">ブランド名</InputLabel>
                <Select
                  labelId="brandName-select-label"
                  id="brandName-select"
                  value={brandName}
                  label="ブランド名"
                  onChange={onChangeBrandNameHandler}
                  required
                >
                  <MenuItem value={"Gibson"}>Gibson</MenuItem>
                  <MenuItem value={"Fender"}>Fender</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="filled"
                margin="dense"
                required
                fullWidth
                id="gearName"
                label="機材名"
                name="gearName"
                autoComplete="gearName"
                value={gearName}
                onChange={(e) => setGearName(e.target.value)}
              />
              <TextField
                variant="filled"
                margin="dense"
                fullWidth
                id="tweetMsg"
                label="機材紹介コメント"
                name="tweetMsg"
                autoComplete="tweetMsg"
                multiline={true}
                minRows={3}
                value={tweetMsg}
                onChange={(e) => setTweetMsg(e.target.value)}
              />
              <div className="text-center mt-[10px]">
                <p className="mb-[5px]">
                  <Link
                    to="/privacy/"
                    target="_blank"
                    className="underline hover:no-underline"
                  >
                    利用規約
                  </Link>
                  に同意して
                </p>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!tweetImage || !category || !brandName || !gearName}
                >
                  <span
                    className={
                      tweetImage && category && brandName && gearName
                        ? "text-white"
                        : "text-gray"
                    }
                  >
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
