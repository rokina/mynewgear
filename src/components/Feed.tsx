import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import Auth from "./Auth";
import Post from "./Post";
import TweetInput from "./TweetInput";

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
    likedUser: [];
  }
  const [posts, setPosts] = useState<PostObj[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector(selectUser);
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

  const handleOpen = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div className="text-4xl text-center">
        <p>my new gear...</p>
        <p className="mt-4">あなたの素敵な機材を共有しませんか</p>
        <button
          onClick={handleOpen}
          className="text-xl font-bold border border-white rounded-lg py-2 px-4 mt-6 transition-colors hover:bg-white hover:text-black-light"
        >
          my new gear を投稿
        </button>
      </div>
      {user.uid ? (
        <TweetInput openModal={openModal} setOpenModal={setOpenModal} />
      ) : (
        <Auth openModal={openModal} setOpenModal={setOpenModal} />
      )}
      {/* 「my new gear投稿」ボタン押下時
      未ログイン＝ログインor新規登録モーダル
      ログイン済み＝投稿画面
      TweetInputからフォームだけ分離する */}

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
