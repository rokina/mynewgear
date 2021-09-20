import { Avatar, Backdrop, Fade, Modal } from "@material-ui/core";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

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
  likeCount: number;
  bookmarkCount: number;
  likedUser: [];
}

interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
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
  const [bookmarkCount, setBookmarkCount] = useState(props.bookmarkCount);
  const [bookmarkState, setBookmarkState] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      text: "",
      username: "",
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
            timestamp: doc.data().timestamp,
          }))
        );
      });

    return () => {
      unSub();
    };
  }, [props.postId]);

  useEffect(() => {
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
  }, [props.postId, user.uid]);

  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .collection("bookmarkPosts")
      .doc(props.postId)
      .get()
      .then((doc) => {
        if (doc.data()?.post) {
          setBookmarkState(true);
        } else {
          setBookmarkState(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.postId, user.uid]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts").doc(props.postId).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
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

  // TODO: いいねと共通化できそう
  const bookmarkSave = (state: boolean) => {
    if (state) {
      db.collection("users")
        .doc(user.uid)
        .collection("bookmarkPosts")
        .doc(props.postId)
        .set({
          post: props.postId,
        });
    } else {
      db.collection("users")
        .doc(user.uid)
        .collection("bookmarkPosts")
        .doc(props.postId)
        .delete();
    }
  };

  const bookmarkButton = () => {
    if (!bookmarkState) {
      bookmarkSave(true);
      const newBookmarkCount = bookmarkCount + 1;
      setBookmarkState(true);
      setBookmarkCount(newBookmarkCount);
      db.collection("posts").doc(props.postId).update({
        bookmarkCount: newBookmarkCount,
      });
    } else {
      bookmarkSave(false);
      const newBookmarkCount = bookmarkCount - 1;
      setBookmarkState(false);
      setBookmarkCount(newBookmarkCount);
      db.collection("posts").doc(props.postId).update({
        bookmarkCount: newBookmarkCount,
      });
    }
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <li className="m-2">
        <div
          onClick={handleOpen}
          className="block relative w-72 rounded-2xl overflow-hidden cursor-pointer"
        >
          {props.image && (
            <img src={props.image} alt="" className="object-cover w-72 h-72" />
          )}
          <span className="absolute bottom-2 right-2">#{props.category}</span>
          <div className="absolute top-0 w-full h-full opacity-0 transition flex items-center hover:opacity-100 hover:bg-black-dark hover:bg-opacity-50">
            <div className="px-5">
              <span className="text-xl block break-all">
                # {props.brandName}
              </span>
              <span className="text-lg block break-all">{props.gearName}</span>
              <div className="absolute right-4 bottom-3 flex items-center">
                <span className="text-white text-xl flex items-center">
                  {/* TODO:SVGファイルの扱い考える */}
                  <svg width="20" height="18.35" viewBox="0 0 30 27.525">
                    <path
                      d="M18,32.025l-2.175-1.98C8.1,23.04,3,18.42,3,12.75A8.17,8.17,0,0,1,11.25,4.5,8.983,8.983,0,0,1,18,7.635,8.983,8.983,0,0,1,24.75,4.5,8.17,8.17,0,0,1,33,12.75c0,5.67-5.1,10.29-12.825,17.31Z"
                      transform="translate(-3 -4.5)"
                      className="fill-current"
                    />
                  </svg>
                  <span className="ml-1.5">{likeCount}</span>
                </span>
                <span className="text-white text-xl flex items-center ml-3">
                  <svg width="15" height="20" viewBox="0 0 15 20">
                    <path
                      d="M0,20V1.875A1.875,1.875,0,0,1,1.875,0h11.25A1.875,1.875,0,0,1,15,1.875V20L7.5,15.625Z"
                      className="fill-current"
                    />
                  </svg>
                  <span className="ml-1.5">{bookmarkCount}</span>
                </span>
                <span className="text-white text-xl flex items-center ml-3">
                  <svg width="20" height="17.5" viewBox="0 0 20 17.5">
                    <path
                      d="M10,2.25c-5.523,0-10,3.637-10,8.125A7.212,7.212,0,0,0,2.227,15.48,9.938,9.938,0,0,1,.086,19.223a.311.311,0,0,0-.059.34.306.306,0,0,0,.285.188A8.933,8.933,0,0,0,5.8,17.742,11.913,11.913,0,0,0,10,18.5c5.523,0,10-3.637,10-8.125S15.523,2.25,10,2.25Z"
                      transform="translate(0 -2.25)"
                      className="fill-current"
                    />
                  </svg>
                  <span className="ml-1.5">{comments.length}</span>
                </span>
              </div>
            </div>
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
                className="relative bg-black border border-gray rounded-2xl px-12 py-28 flex items-start"
              >
                {props.image && (
                  <div className="w-8/12">
                    <img
                      src={props.image}
                      alt=""
                      className="rounded-2xl m-auto"
                    />
                  </div>
                )}
                <div className="ml-10 w-4/12">
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
                      {/* TODO: userIDも投稿に紐付けるようにする */}
                      <p className="text-gray text-x">@rokiroki</p>
                    </div>
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
                            (likeState ? "text-red" : "text-white")
                          }
                          onClick={() => {
                            likeButton();
                          }}
                        >
                          <svg
                            id="icon_link"
                            width="30"
                            height="27.525"
                            viewBox="0 0 30 27.525"
                          >
                            <path
                              d="M18,32.025l-2.175-1.98C8.1,23.04,3,18.42,3,12.75A8.17,8.17,0,0,1,11.25,4.5,8.983,8.983,0,0,1,18,7.635,8.983,8.983,0,0,1,24.75,4.5,8.17,8.17,0,0,1,33,12.75c0,5.67-5.1,10.29-12.825,17.31Z"
                              transform="translate(-3 -4.5)"
                              className="fill-current"
                            />
                          </svg>

                          <span className="text-3xl text-white ml-2">
                            {likeCount}
                          </span>
                        </button>
                        <button
                          className={
                            "flex items-center " +
                            (bookmarkState ? "text-green" : "text-white")
                          }
                          onClick={() => {
                            bookmarkButton();
                          }}
                        >
                          <svg width="22.5" height="30" viewBox="0 0 22.5 30">
                            <path
                              d="M0,30V2.813A2.812,2.812,0,0,1,2.813,0H19.688A2.812,2.812,0,0,1,22.5,2.813V30L11.25,23.437Z"
                              className="fill-current"
                            />
                          </svg>

                          <span className="text-3xl text-white ml-2">
                            {bookmarkCount}
                          </span>
                        </button>
                      </div>
                    </div>

                    <p className="text-white text-xl mt-8">{props.text}</p>
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
                              <span className="text-xs ml-1 text-gray">
                                {/* TODO: ユーザーID表示する */}
                                @user_id
                              </span>
                              <span className="text-xs ml-1 text-gray">
                                {new Date(
                                  com.timestamp?.toDate()
                                ).toLocaleString()}
                              </span>
                            </div>
                            <span>{com.text}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <form onSubmit={newComment}>
                    <div className="flex items-center mt-5">
                      <Avatar src={user.photoUrl} />
                      <textarea
                        name=""
                        id=""
                        placeholder="返信を投稿"
                        className="bg-transparent rounded border border-gray ml-2 px-2 py-1 text-white w-72"
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
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      </li>
    </>
  );
};

export default Post;
