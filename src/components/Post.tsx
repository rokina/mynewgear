import React, { useState } from "react";
// import { db } from "../firebase";
// import firebase from "firebase/app";
// import { useSelector } from "react-redux";
// import { selectUser } from "../features/userSlice";
import { Modal, Backdrop, Fade } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import MessageIcon from "@material-ui/icons/Message";
// import SendIcon from "@material-ui/icons/Send";

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
}

// interface COMMENT {
//   id: string;
//   avatar: string;
//   text: string;
//   timestamp: any;
//   username: string;
// }

function getModalStyle() {
  const width = 1400;
  const height = 900;
  const top = 50;
  const left = 50;

  return {
    width: `${width}px`,
    height: `${height}px`,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   small: {
//     width: theme.spacing(3),
//     height: theme.spacing(3),
//     marginRight: theme.spacing(1),
//   },
// }));

const Post: React.FC<PROPS> = (props) => {
  // const classes = useStyles();
  // const user = useSelector(selectUser);
  // const [likeCount, setLikeCount] = useState(props.likeCount);
  // const [check, setCheck] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // const [openComments, setOpenComments] = useState(false);
  // const [comment, setComment] = useState("");
  // const [comments, setComments] = useState<COMMENT[]>([
  //   {
  //     id: "",
  //     avatar: "",
  //     text: "",
  //     username: "",
  //     timestamp: null,
  //   },
  // ]);

  // useEffect(() => {
  //   const unSub = db
  //     .collection("posts")
  //     .doc(props.postId)
  //     .collection("comments")
  //     .orderBy("timestamp", "desc")
  //     .onSnapshot((snapshot) => {
  //       setComments(
  //         snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           avatar: doc.data().avatar,
  //           text: doc.data().text,
  //           username: doc.data().username,
  //           timestamp: doc.data().timestamp,
  //         }))
  //       );
  //     });

  //   return () => {
  //     unSub();
  //   };
  // }, [props.postId]);

  // const newComment = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   db.collection("posts").doc(props.postId).collection("comments").add({
  //     avatar: user.photoUrl,
  //     text: comment,
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     username: user.displayName,
  //   });
  //   setComment("");
  // };

  // const likeButton = () => {
  //   console.log("likeButton");
  //   let test = likeCount;
  //   !check ? test++ : test--;
  //   setLikeCount(test);
  //   db.collection("posts").doc(props.postId).update({
  //     likeCount: test,
  //   });
  // };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      {/* <div>
        <Avatar src={props.avatar} />
      </div> */}
      {/* <div>
            <h3>
              <span>@{props.username}</span>
              <span>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div> */}
      {/* <p>
        @{props.username}/{props.category}/{props.brandName}/{props.gearName}/
        {props.text}/{new Date(props.timestamp?.toDate()).toLocaleString()}
      </p> */}
      <li className="m-2">
        <a
          href="#"
          onClick={handleOpen}
          className="block relative w-72 rounded-2xl overflow-hidden"
        >
          {props.image && (
            <img src={props.image} alt="" className="object-cover w-72 h-72" />
          )}
          <span className="absolute bottom-2 right-2">#{props.category}</span>
          <div className="absolute top-0 w-full h-full opacity-0 transition flex items-center hover:opacity-100 hover:bg-black hover:bg-opacity-50">
            <div className="px-5">
              <span className="text-xl block break-all">
                # {props.brandName}
              </span>
              <span className="text-lg block break-all">{props.gearName}</span>
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
                className="relative bg-black border border-gray-500 rounded-2xl px-12 py-36 flex items-start"
              >
                {props.image && (
                  <img
                    src={props.image}
                    alt=""
                    className="rounded-2xl w-8/12"
                  />
                )}
                <div className="ml-10">
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
                      <p className="text-gray-400 text-x">@rokiroki</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-white text-2xl">
                      <p>{props.brandName}</p>
                      <p>{props.gearName}</p>
                    </div>
                    <p className="text-white text-xl mt-8">{props.text}</p>
                    <p className="text-gray-400 text-sm text-right mt-3">
                      {new Date(props.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>

          {/* <MessageIcon onClick={() => setOpenComments(!openComments)} />
        <button
          onClick={() => {
            // setCheck(!check);
            likeButton();
          }}
        >
          いいね {props.likeCount}
        </button> */}

          {/* {openComments && (
            <>
              {comments.map((com) => (
                <div key={com.id}>
                  <Avatar src={com.avatar} />

                  <span>@{com.username}</span>
                  <span>{com.text} </span>
                  <span>
                    {new Date(com.timestamp?.toDate()).toLocaleString()}
                  </span>
                </div>
              ))}

              <form onSubmit={newComment}>
                <div>
                  <input
                    type="text"
                    placeholder="Type new comment..."
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setComment(e.target.value)
                    }
                  />
                  <button disabled={!comment} type="submit">
                    <SendIcon />
                  </button>
                </div>
              </form>
            </>
          )} */}
        </a>
      </li>
    </>
  );
};

export default Post;
