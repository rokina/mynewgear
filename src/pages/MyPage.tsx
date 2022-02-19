import { useEffect, useState } from "react";
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
  const [likedPosts, setLikedPosts] = useState<PostObj[]>([]);
  const [myPosts, setMyPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    if (user.uid !== "") {
      const syncLikedPosts = db
        .collection("posts")
        .where("likedUser", "array-contains", user.uid)
        .onSnapshot((snapshot) =>
          setLikedPosts(
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
      const syncMyPosts = db
        .collection("posts")
        .where("userID", "==", user.uid)
        .onSnapshot((snapshot) =>
          setMyPosts(
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
        syncLikedPosts();
        syncMyPosts();
      };
    }
  }, [user.uid]);

  return (
    <>
      {likedPosts[0]?.id && (
        <section className="mt-[20px] md:mt-[0px]">
          <h2 className="text-[18px]">いいねした投稿</h2>
          <ul className="flex flex-wrap mx-[-5px]">
            {likedPosts.map((post) => (
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
      {myPosts[0]?.id && (
        <section className="mt-[20px]">
          <h2 className="text-[18px]">自分の投稿</h2>
          <ul className="flex flex-wrap mx-[-5px]">
            {myPosts.map((post) => (
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
