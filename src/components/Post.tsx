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

interface PROPS {
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

interface COMMENT {
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

const Post: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [likeState, setLikeState] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      text: "",
      username: "",
      userID: "",
      timestamp: null,
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setComments(
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
      unSub();
    };
  }, [props.postId]);

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
  }, [props.postId, user.uid]);

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

  const likeSave = (state: boolean) => {
    if (state) {
      db.collection("posts")
        .doc(props.postId)
        .update({
          likedUser: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
      db.collection("users")
        .doc(user.uid)
        .collection("likePosts")
        .doc(props.postId)
        .set({
          post: props.postId,
        });
    } else {
      db.collection("posts")
        .doc(props.postId)
        .update({
          likedUser: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
      db.collection("users")
        .doc(user.uid)
        .collection("likePosts")
        .doc(props.postId)
        .delete();
    }
  };

  const likeButton = () => {
    if (!likeState) {
      likeSave(true);
      const newLikeCount = likeCount + 1;
      setLikeState(true);
      setLikeCount(newLikeCount);
      db.collection("posts").doc(props.postId).update({
        likeCount: newLikeCount,
      });
    } else {
      likeSave(false);
      const newLikeCount = likeCount - 1;
      setLikeState(false);
      setLikeCount(newLikeCount);
      db.collection("posts").doc(props.postId).update({
        likeCount: newLikeCount,
      });
    }
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const postDelete = () => {
    db.collection("posts")
      .doc(props.postId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const pattern = /images.*jpg/g; //投稿画像はWebPに変換する予定なので将来的にはWebPを指定する
          const data = doc.data()!.image;
          const result = data.match(pattern);

          const replaced = result[0].replace("%2F", "/");

          const desertRef = storageRef.child(replaced);

          desertRef
            .delete()
            .then(function () {})
            .catch(function (error) {});
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    db.collection("posts")
      .doc(props.postId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    setOpen(false);
  };

  return (
    <>
      <li
        className="w-[calc(20%-(50px/5))] relative cursor-pointer overflow-hidden rounded-[20px] before:block before:pt-[100%] m-[5px] lg:w-[calc(33.333333%-(30px/3))] md:w-[calc(100%-(20px/1))] md:m-[10px]"
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
                <span className="ml-[6px]">{comments.length}</span>
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
                      <span className="text-black">投稿を削除</span>
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClickClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"投稿を削除しますか？"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          この操作は取り消せません。本当に削除してもよろしいですか？
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClickClose}>キャンセル</Button>
                        <Button onClick={postDelete} autoFocus>
                          削除
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

                <p className="text-white text-[20px] mt-[20px]">{props.text}</p>
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
              {comments && (
                <>
                  {comments.map((com) => (
                    <div
                      key={com.id}
                      className="text-white flex pt-[12px] pb-[8px] border-b border-gray"
                    >
                      <Avatar src={com.avatar} />

                      <div className="ml-[8px] w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-[16px] max-w-[98px] overflow-hidden overflow-ellipsis whitespace-nowrap lg:max-w-[200px] md:max-w-[95px]">
                              {com.username}
                            </span>
                            <span className="text-[12px] ml-[5px] text-gray w-[50px] overflow-hidden overflow-ellipsis lg:w-[110px] md:w-[45px]">
                              @{com.userID}
                            </span>
                          </div>
                          <span className="text-[12px] ml-[5px] text-gray">
                            {new Date(com.timestamp?.toDate()).toLocaleString()}
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
                      placeholder="返信を投稿"
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
                      返信
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-white mt-[20px] text-[16px]">
                    ログインするとコメントができるようになります
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
