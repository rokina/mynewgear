import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import TweetInput from "./TweetInput";
import Post from "./Post";

const Feed: React.FC = () => {
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState([
    {
      id: "",
      avatar: "",
      image: "",
      category: "",
      text: "",
      brandName: "",
      gearName: "",
      timestamp: null,
      username: "",
      likeCount: 0,
    },
  ]);
  useEffect(() => {
    const unSub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            category: doc.data().category,
            text: doc.data().text,
            brandName: doc.data().brandName,
            gearName: doc.data().gearName,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
            likeCount: doc.data().likeCount,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, []);
  return (
    <>
      <TweetInput />
      <section className="mt-5">
        <h2 className="text-lg">#mynewgear</h2>
        {posts[0]?.id && (
          <ul className="flex flex-wrap mt-2 space-x-4">
            {posts.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                avatar={post.avatar}
                image={post.image}
                category={post.category}
                text={post.text}
                brandName={post.brandName}
                gearName={post.gearName}
                timestamp={post.timestamp}
                username={post.username}
                likeCount={post.likeCount}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default Feed;
