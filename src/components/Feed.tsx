import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";
import TweetInput from "./TweetInput";

const Feed: React.FC = () => {
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
  const [posts, setPosts] = useState<PostObj[]>([]);
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
            bookmarkCount: doc.data().bookmarkCount,
            likedUser: doc.data().likedUser,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, []);

  const posts_filter = (cat: string) => {
    const result = posts.filter((post) => {
      return post.category === cat;
    });
    return result;
  };

  const posts_guitar = posts_filter("guitar");
  const posts_bass = posts_filter("bass");

  return (
    <>
      <TweetInput />
      <section className="mt-5">
        <h2 className="text-lg">#mynewgear</h2>
        {posts[0]?.id && (
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
                likeCount={post.likeCount}
                bookmarkCount={post.bookmarkCount}
                likedUser={post.likedUser}
              />
            ))}
          </ul>
        )}
      </section>
      <section className="mt-8 mb-8">
        <h2 className="text-lg">#guitar</h2>
        {posts_guitar[0]?.id && (
          <ul className="flex flex-wrap mx-[-5px]">
            {posts_guitar.map((post) => (
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
      <section className="mt-8 mb-8">
        <h2 className="text-lg">#bass</h2>
        {posts_bass[0]?.id && (
          <ul className="flex flex-wrap mx-[-5px]">
            {posts_bass.map((post) => (
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

export default Feed;
