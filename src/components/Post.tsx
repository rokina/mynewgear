import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MessageIcon from "@material-ui/icons/Message";
import SendIcon from "@material-ui/icons/Send";

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

interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PROPS> = (props) => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [likeCount, setLikeCount] = useState(props.likeCount);
  // const [check, setCheck] = useState(false);
  const [openComments, setOpenComments] = useState(false);
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

  const likeButton = () => {
    console.log("likeButton");
    // let test = likeCount;
    // !check ? test++ : test--;
    // setLikeCount(test);
    // db.collection("posts").doc(props.postId).update({
    //   likeCount: test,
    // });
  };
  return (
    <div>
      {/* <div>
        <Avatar src={props.avatar} />
      </div> */}
      <div>
        <div>
          {/* <div>
            <h3>
              <span>@{props.username}</span>
              <span>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div> */}
          <div>
            <p>
              @{props.username}/{props.category}/{props.brandName}/
              {props.gearName}/{props.text}/
              {new Date(props.timestamp?.toDate()).toLocaleString()}
            </p>
          </div>
        </div>
        {props.image && (
          <div>
            <img src={props.image} alt="" width={300} />
          </div>
        )}

        <MessageIcon onClick={() => setOpenComments(!openComments)} />
        <button
          onClick={() => {
            // setCheck(!check);
            likeButton();
          }}
        >
          いいね {props.likeCount}
        </button>

        {openComments && (
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
        )}
      </div>
    </div>
  );
};

export default Post;
