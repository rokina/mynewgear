import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
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
    likeCount: number;
    bookmarkCount: number;
    likedUser: [];
  }
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState<PostObj[]>([]);
  useEffect(() => {
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
            likeCount: doc.data().likeCount,
            bookmarkCount: doc.data().bookmarkCount,
            likedUser: doc.data().likedUser,
          }))
        )
      );
    return () => {
      unSub();
    };
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
                likeCount={post.likeCount}
                bookmarkCount={post.bookmarkCount}
                likedUser={post.likedUser}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default MyPage;