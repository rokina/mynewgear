import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { auth, db } from "../firebase";
import Post from "./Post";

const MyPage: React.FC = () => {
  interface PostObj {
    id: string;
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
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState<PostObj[]>([]);
  const [posts2, setPosts2] = useState<PostObj[]>([]);
  useEffect(() => {
    if (user.uid !== "") {
      const unSub = db
        .collection("posts")
        .where("likedUser", "array-contains", user.uid)
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
              userID: doc.data().userID,
              likeCount: doc.data().likeCount,
              likedUser: doc.data().likedUser,
            }))
          )
        );
      return () => {
        unSub();
      };
    }
  }, [user.uid]);
  useEffect(() => {
    if (user.uid !== "") {
      const unSub = db
        .collection("posts")
        .where("userID", "==", user.uid)
        .onSnapshot((snapshot) =>
          setPosts2(
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
              userID: doc.data().userID,
              likeCount: doc.data().likeCount,
              likedUser: doc.data().likedUser,
            }))
          )
        );
      return () => {
        unSub();
      };
    }
  }, [user.uid]);

  return (
    <>
      <section className="mt-5">
        <h2 className="text-lg">いいねした投稿</h2>
        {posts[0]?.id && (
          <ul className="flex flex-wrap -m-2 mt-0">
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
                userID={post.userID}
                likeCount={post.likeCount}
                likedUser={post.likedUser}
              />
            ))}
          </ul>
        )}
      </section>
      <section className="mt-5">
        <h2 className="text-lg">自分の投稿</h2>
        {posts2[0]?.id && (
          <ul className="flex flex-wrap -m-2 mt-0">
            {posts2.map((post) => (
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
                userID={post.userID}
                likeCount={post.likeCount}
                likedUser={post.likedUser}
              />
            ))}
          </ul>
        )}
      </section>
      <div className="mt-[50px] text-center">
        <Link to="/">
          <button
            className="text-white"
            onClick={async () => {
              await auth.signOut();
            }}
          >
            ログアウト
          </button>
        </Link>
      </div>
    </>
  );
};

export default MyPage;
