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
import imageCompression from "browser-image-compression";
import firebase from "firebase/app";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Data from "../brandName.json";
import { selectUser } from "../features/userSlice";
import { db, storage } from "../firebase";

interface Props {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostInput = (props: Props) => {
  const user = useSelector(selectUser);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [postMsg, setPostMsg] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [gearName, setGearName] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const brandNameData = Data.brandName;
  const postButtonFlag = !postImage || !category || !brandName || !gearName;

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

  const onChangeImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files![0]) {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 2200,
        initialQuality: 0.8,
      };
      const file = await imageCompression(e.target.files![0], options);
      setPostImage(file);
      setPreview(window.URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const sendPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + postImage.name;
      const uploadPostImg = storage.ref(`images/${fileName}`).put(postImage);

      uploadPostImg.on(
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
                text: postMsg,
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
    }
    setPostImage(null);
    setPreview("");
    setCategory("");
    setPostMsg("");
    setBrandName("");
    setGearName("");
    props.setOpenModal(false);
  };

  const handleClose = (): void => {
    props.setOpenModal(false);
  };

  return (
    <>
      <Modal
        open={props.openModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="backdrop-blur-[20px] mr-[15px] lg:mr-0"
      >
        <Fade in={props.openModal}>
          <div className="relative bg-white border rounded-[16px] py-[40px] px-[40px] flex items-center justify-center w-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[90%]">
            <form onSubmit={sendPost}>
              <div className="mb-[5px] flex justify-around items-center md:flex-col">
                <Button type="button" variant="contained" color="primary">
                  <label className="text-white cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="opacity-0 hidden absolute appearance-none"
                      onChange={onChangeImageHandler}
                    />
                    ????????????????????????
                  </label>
                </Button>
                {preview && (
                  <img
                    src={preview}
                    alt=""
                    className="max-w-[200px] max-h-[200px] md:mt-[15px] md:max-w-[150px] md:max-h-[150px]"
                  />
                )}
              </div>
              <FormControl fullWidth variant="filled" margin="dense">
                <InputLabel id="category-select-label">???????????????</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  label="???????????????"
                  onChange={onChangeCategoryHandler}
                  required
                >
                  <MenuItem value={"guitar"}>Guitar</MenuItem>
                  <MenuItem value={"bass"}>Bass</MenuItem>
                  <MenuItem value={"effector"}>Effector</MenuItem>
                  <MenuItem value={"amp"}>Amp</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled" margin="dense">
                <InputLabel id="brandName-select-label">???????????????</InputLabel>
                <Select
                  labelId="brandName-select-label"
                  id="brandName-select"
                  value={brandName}
                  label="???????????????"
                  onChange={onChangeBrandNameHandler}
                  required
                >
                  {brandNameData.map((brandName) => (
                    <MenuItem value={brandName.name} key={brandName.name}>
                      {brandName.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                variant="filled"
                margin="dense"
                required
                fullWidth
                id="gearName"
                label="?????????"
                name="gearName"
                autoComplete="gearName"
                multiline={true}
                minRows={2}
                value={gearName}
                onChange={(e) => setGearName(e.target.value)}
              />
              <TextField
                variant="filled"
                margin="dense"
                fullWidth
                id="postMsg"
                label="????????????????????????"
                name="postMsg"
                autoComplete="postMsg"
                multiline={true}
                minRows={3}
                value={postMsg}
                onChange={(e) => setPostMsg(e.target.value)}
              />
              <div className="text-center mt-[10px]">
                <p className="mb-[5px]">
                  <Link
                    to="/privacy/"
                    target="_blank"
                    className="underline hover:no-underline"
                  >
                    ????????????
                  </Link>
                  ???????????????
                </p>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={postButtonFlag}
                >
                  <span className={postButtonFlag ? "text-gray" : "text-white"}>
                    my new gear ?????????
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

export default PostInput;
