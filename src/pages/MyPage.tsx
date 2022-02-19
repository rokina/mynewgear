import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import { selectUser } from "../features/userSlice";
import { auth, db } from "../firebase";

const MyPage = () => {
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
      {posts[0]?.id && (
        <section className="mt-[20px] md:mt-[0px]">
          <h2 className="text-[18px]">いいねした投稿</h2>
          <ul className="flex flex-wrap mx-[-5px]">
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
        </section>
      )}
      {posts2[0]?.id && (
        <section className="mt-[20px]">
          <h2 className="text-[18px]">自分の投稿</h2>
          <ul className="flex flex-wrap mx-[-5px]">
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
        </section>
      )}
      <div className="mt-[50px] text-center md:mt-[15px]">
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
