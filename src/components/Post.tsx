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
      .orderBy("timestamp", "desc")
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
        className="w-[calc(20%-(50px/5))] relative cursor-pointer before:block before:pt-[100%] m-[5px] lg:w-[calc(33.333333%-(30px/3))] md:w-[calc(100%-(10px/1))]"
        onClick={handleOpen}
      >
        {props.image && (
          <img
            src={props.image}
            alt=""
            className="object-cover absolute w-full h-full top-0 right-0 bottom-0 left-0 m-auto rounded-[20px]"
          />
        )}
        <span className="absolute bottom-2 right-2">#{props.category}</span>
        <div className="absolute top-0 w-full h-full opacity-0 transition flex items-center rounded-[20px] hover:opacity-100 hover:bg-black-dark hover:bg-opacity-50 hover:backdrop-grayscale hover:backdrop-blur-[3px]">
          <div className="px-5">
            <span className="text-xl block break-all"># {props.brandName}</span>
            <span className="text-lg block break-all">{props.gearName}</span>
            <div className="absolute right-4 bottom-3 flex items-center">
              <span className="text-white text-xl flex items-center">
                <div className="w-[20px] h-auto">
                  <IconFavorite />
                </div>
                <span className="ml-1.5">{likeCount}</span>
              </span>
              <span className="text-white text-xl flex items-center ml-3">
                <div className="w-[20px] h-auto">
                  <IconComment />
                </div>
                <span className="ml-1.5">{comments.length}</span>
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
            className="relative bg-black border border-gray rounded-2xl px-12 py-28 flex items-start md:px-[15px] md:py-[20px] md:block md:overflow-y-auto"
          >
            {props.image && (
              <div className="w-8/12 h-full md:w-full md:h-auto md:hidden">
                <img
                  src={props.image}
                  alt=""
                  className="rounded-[20px] m-auto max-w-full max-h-full"
                />
              </div>
            )}
            <div className="ml-10 w-4/12 md:w-full md:ml-0">
              <div className="flex items-center">
                <img
                  src={props.avatar}
                  alt=""
                  className="rounded-full w-20 h-20"
                />
                <div className="ml-5">
                  <p className="text-white text-2xl font-bold">
                    {props.username}
                  </p>
                  <p className="text-gray text-x w-[5em] overflow-hidden overflow-ellipsis">
                    @{props.userID}
                  </p>
                </div>
                {props.userID === user.uid && (
                  <div className="text-right w-full">
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
                          この操作は取り消せません。マイページ、あなたをフォローしているアカウントのタイムライン、Twitterの検索結果からツイートが削除されます。
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
              <div className="mt-5 pb-1 border-b border-gray">
                <div className="flex items-center justify-between">
                  <div className="text-white text-2xl w-4/6">
                    <p>{props.brandName}</p>
                    <p>{props.gearName}</p>
                  </div>
                  <div className="flex items-center justify-between w-2/6">
                    <button
                      className={
                        "flex items-center " +
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

                      <span className="text-3xl text-white ml-2">
                        {likeCount}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-white text-xl mt-8">{props.text}</p>
                {props.image && (
                  <div className="w-8/12 h-full mt-[20px] hidden md:w-full md:h-auto md:block">
                    <img
                      src={props.image}
                      alt=""
                      className="rounded-[20px] m-auto max-w-full max-h-full"
                    />
                  </div>
                )}
                <p className="text-gray text-sm text-right mt-3">
                  {new Date(props.timestamp?.toDate()).toLocaleString()}
                </p>
              </div>
              {comments && (
                <>
                  {comments.map((com) => (
                    <div
                      key={com.id}
                      className="text-white flex pt-3 pb-2 border-b border-gray"
                    >
                      <Avatar src={com.avatar} />

                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-base">{com.username}</span>
                          <span className="text-xs ml-1 text-gray w-[5em] overflow-hidden overflow-ellipsis">
                            @{com.userID}
                          </span>
                          <span className="text-xs ml-1 text-gray">
                            {new Date(com.timestamp?.toDate()).toLocaleString()}
                          </span>
                        </div>
                        <span>{com.text}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {user.uid ? (
                <form onSubmit={newComment}>
                  <div className="flex items-center mt-5">
                    <Avatar src={user.photoUrl} />
                    <textarea
                      name=""
                      id=""
                      placeholder="返信を投稿"
                      className="bg-transparent rounded border border-gray ml-2 px-2 py-1 text-black w-72"
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setComment(e.target.value)
                      }
                    ></textarea>
                    <button
                      className="text-white text-xs bg-blue rounded-xl py-1 px-2 ml-2"
                      disabled={!comment}
                      type="submit"
                    >
                      返信
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-white mt-[15px] text-[14px]">
                    ログインするとコメントを送ることができます
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-white absolute top-[25px] right-[25px]"
            >
              <img
                src={close_icon}
                alt=""
                width="50"
                height="50"
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
