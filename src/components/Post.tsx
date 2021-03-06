import {
  Avatar,
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Modal,
} from "@material-ui/core";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db, storageRef } from "../firebase";
import close_icon from "../img/icon_close.svg";
import { ReactComponent as IconComment } from "../img/icon_comment.svg";
import { ReactComponent as IconFavorite } from "../img/icon_favorite.svg";

interface Props {
  postId: string;
  avatar: string;
  image: string;
  category: string;
  text: string;
  brandName: string;
  gearName: string;
  timestamp: any;
  username: string;
  userID: string;
  likeCount: number;
  likedUser: [];
}

interface Comment {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
  userID: string;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Post = (props: Props) => {
  const user = useSelector(selectUser);
  const [likeCount, setLikeCount] = useState<number>(props.likeCount);
  const [likeState, setLikeState] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const [postedComment, setPostedComment] = useState<Comment[]>([
    {
      id: "",
      avatar: "",
      text: "",
      username: "",
      userID: "",
      timestamp: null,
    },
  ]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts").doc(props.postId).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
      userID: user.uid,
    });
    setComment("");
  };

  const likeSave = (state: boolean): void => {
    const postId = db.collection("posts").doc(props.postId);
    const likePostId = db
      .collection("users")
      .doc(user.uid)
      .collection("likePosts")
      .doc(props.postId);
    if (state) {
      postId.update({
        likedUser: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
      likePostId.set({
        post: props.postId,
      });
    } else {
      postId.update({
        likedUser: firebase.firestore.FieldValue.arrayRemove(user.uid),
      });
      likePostId.delete();
    }
  };

  const likeButton = (): void => {
    let newLikeCount: number = 0;
    if (!likeState) {
      newLikeCount = likeCount + 1;
      likeSave(true);
      setLikeState(true);
    } else {
      newLikeCount = likeCount - 1;
      likeSave(false);
      setLikeState(false);
    }
    setLikeCount(newLikeCount);
    db.collection("posts").doc(props.postId).update({
      likeCount: newLikeCount,
    });
  };

  const handleOpen = (): void => {
    setOpenModal(true);
  };

  const handleClose = (): void => {
    setOpenModal(false);
  };

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClickClose = (): void => {
    setOpen(false);
  };

  const dateFormat = (date: string): string => {
    const formattedTime = date.replace(/^2[0-9]{3}\/|:[0-9]{2}$/g, "");
    return formattedTime;
  };

  const postDelete = (): void => {
    const post = db.collection("posts").doc(props.postId);
    post
      .get()
      .then((doc) => {
        if (doc.exists) {
          const pattern = /images.*(gif|jpg|jpeg|png)/g;
          const data = doc.data()!.image;
          const result = data.match(pattern);

          const replaced = result[0].replace("%2F", "/");

          const desertRef = storageRef.child(replaced);
          desertRef
            .delete()
            .then(function () {})
            .catch(function (error) {});
          post
            .delete()
            .then(() => {
              console.log("Document successfully deleted!");
            })
            .catch((error) => {
              console.error("Error removing document: ", error);
            });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    setOpen(false);
  };

  useEffect(() => {
    if (user.uid !== "") {
      db.collection("users")
        .doc(user.uid)
        .collection("likePosts")
        .doc(props.postId)
        .get()
        .then((doc) => {
          if (doc.data()?.post) {
            setLikeState(true);
          } else {
            setLikeState(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const syncPostedComment = db
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setPostedComment(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            text: doc.data().text,
            username: doc.data().username,
            userID: doc.data().userID,
            timestamp: doc.data().timestamp,
          }))
        );
      });

    return () => {
      syncPostedComment();
    };
  }, [props.postId, user.uid]);

  return (
    <>
      <li
        className="w-[calc(20%-(50px/5))] relative cursor-pointer overflow-hidden rounded-[20px] z-[1] before:block before:pt-[100%] m-[5px] lg:w-[calc(33.333333%-(30px/3))] md:w-[calc(100%-(20px/1))] md:m-[10px]"
        onClick={handleOpen}
      >
        {props.image && (
          <img
            src={props.image}
            alt=""
            className="object-cover absolute w-full h-full top-0 right-0 bottom-0 left-0 m-auto"
          />
        )}
        <span className="absolute bottom-[6px] right-[10px] md:text-[18px]">
          #{props.category}
        </span>
        <div className="absolute top-0 w-full h-full opacity-0 transition flex items-center hover:opacity-100 hover:bg-black-dark hover:bg-opacity-50 hover:backdrop-grayscale hover:backdrop-blur-[3px]">
          <div className="px-[20px]">
            <span className="text-[20px] block break-all md:text-[22px]">
              # {props.brandName}
            </span>
            <span className="text-[18px] block break-all md:text-[22px] md:mt-[5px]">
              {props.gearName}
            </span>
            <div className="absolute right-[14px] bottom-[6px] flex items-center">
              <span className="text-white text-[20px] flex items-center">
                <div className="w-[20px] h-auto">
                  <IconFavorite />
                </div>
                <span className="ml-[6px]">{likeCount}</span>
              </span>
              <span className="text-white text-[20px] flex items-center ml-[12px]">
                <div className="w-[20px] h-auto">
                  <IconComment />
                </div>
                <span className="ml-[6px]">{postedComment.length}</span>
              </span>
            </div>
          </div>
        </div>
      </li>
      <Modal
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="backdrop-blur-[20px] mr-[15px] lg:mr-0"
        style={{ touchAction: "none" }}
      >
        <Fade in={openModal}>
          <div
            style={getModalStyle()}
            className="w-[90%] h-[90%] relative bg-black border border-gray rounded-[16px] pl-[50px] pr-[30px] py-[100px] flex items-start lg:block lg:overflow-y-auto lg:py-[40px] lg:pl-[40px] lg:pr-[20px] md:pl-[15px] md:pr-[5px] md:py-[15px] md:w-[calc(100%-30px)] md:h-[calc(100%-30px)]"
          >
            {props.image && (
              <div className="w-8/12 h-full lg:w-full lg:h-auto lg:hidden">
                <img
                  src={props.image}
                  alt=""
                  className="rounded-[20px] m-auto max-w-full max-h-full"
                />
              </div>
            )}
            <div className="ml-[40px] pr-[20px] w-4/12 overflow-x-auto h-full lg:w-full lg:ml-0 md:pr-[10px]">
              <div className="flex items-center md:relative">
                <img
                  src={props.avatar}
                  alt=""
                  className="rounded-full w-[50px] h-[50px]"
                />
                <div className="ml-[15px] md:ml-[10px]">
                  <p className="text-white text-[18px] font-bold">
                    {props.username}
                  </p>
                  <p className="text-gray text-[14px] w-[100px] overflow-hidden overflow-ellipsis">
                    @{props.userID}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white absolute hidden right-[0px] md:block"
                >
                  <img
                    src={close_icon}
                    alt=""
                    width="40"
                    height="40"
                    className="md:w-[40px] md:h-[40px]"
                  />
                </button>
                {props.userID === user.uid && (
                  <div className="text-right w-full lg:mr-[40px] md:mr-[45px]">
                    <Button variant="contained" onClick={handleClickOpen}>
                      <span className="text-black">???????????????</span>
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClickClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"??????????????????????????????"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          ???????????????????????????????????????????????????????????????????????????????????????
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClickClose}>???????????????</Button>
                        <Button onClick={postDelete} autoFocus>
                          ??????
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
              </div>
              <div className="mt-[20px] pb-[5px] border-b border-gray">
                <div className="flex items-center justify-between">
                  <div className="text-white text-[22px] w-[calc(100%-77px)]">
                    <p>{props.brandName}</p>
                    <p>{props.gearName}</p>
                  </div>
                  <div className="flex items-center justify-end w-[77px]">
                    <button
                      className={
                        "flex items-center fill-current " +
                        (likeState ? "text-red " : "text-white ") +
                        (!user.uid ? "pointer-events-none" : "")
                      }
                      onClick={() => {
                        likeButton();
                      }}
                    >
                      <div className="w-[30px] h-auto">
                        <IconFavorite />
                      </div>

                      <span className="text-[20px] text-white ml-[10px]">
                        {likeCount}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-white text-[20px] mt-[20px] whitespace-pre-line">
                  {props.text}
                </p>
                {props.image && (
                  <div className="w-8/12 h-full mt-[20px] hidden lg:w-full lg:h-auto lg:block">
                    <img
                      src={props.image}
                      alt=""
                      className="rounded-[20px] m-auto max-w-full max-h-full"
                    />
                  </div>
                )}
                <p className="text-gray text-[14px] text-right mt-[10px]">
                  {new Date(props.timestamp?.toDate()).toLocaleString()}
                </p>
              </div>
              {postedComment && (
                <>
                  {postedComment.map((com) => (
                    <div
                      key={com.id}
                      className="text-white flex pt-[12px] pb-[8px] border-b border-gray"
                    >
                      <Avatar src={com.avatar} />

                      <div className="ml-[8px] w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-[16px] max-w-[98px] overflow-hidden overflow-ellipsis whitespace-nowrap lg:max-w-[200px] md:max-w-[140px]">
                              {com.username}
                            </span>
                            <span className="text-[12px] ml-[5px] text-gray w-[50px] overflow-hidden overflow-ellipsis lg:w-[110px] md:w-[45px]">
                              @{com.userID}
                            </span>
                          </div>
                          <span className="text-[12px] ml-[5px] text-gray">
                            {dateFormat(
                              new Date(com.timestamp?.toDate()).toLocaleString()
                            )}
                          </span>
                        </div>
                        <span className="break-all whitespace-pre-line">
                          {com.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {user.uid ? (
                <form onSubmit={newComment}>
                  <div className="flex items-center mt-[15px]">
                    <Avatar src={user.photoUrl} />
                    <textarea
                      name=""
                      id=""
                      placeholder="???????????????"
                      className="h-[82px] bg-transparent rounded-[4px] border border-gray ml-[8px] px-[8px] py-[4px] text-black w-[calc(100%-40px-42px-8px-8px)]"
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setComment(e.target.value)
                      }
                    ></textarea>
                    <button
                      className={
                        "text-white text-[12px] min-w-[42px] rounded-[10px] py-[4px] px-[8px] ml-[8px] " +
                        (!comment ? "bg-gray pointer-events-none " : "bg-blue ")
                      }
                      disabled={!comment}
                      type="submit"
                    >
                      ??????
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-white mt-[20px] text-[16px]">
                    ??????????????????????????????????????????????????????????????????
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-white absolute top-[25px] right-[25px] md:hidden"
            >
              <img
                src={close_icon}
                alt=""
                width="40"
                height="40"
                className="md:w-[40px] md:h-[40px]"
              />
            </button>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default Post;
