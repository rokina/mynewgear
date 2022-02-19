import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Auth from "../components/Auth";
import Post from "../components/Post";
import PostInput from "../components/PostInput";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import classes from "../scss/mainPage.module.scss";

const MainPage = () => {
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

  const postsFilter = (cat: string): PostObj[] => {
    const filteredObj = posts.filter((post) => {
      return post.category === cat;
    });
    return filteredObj;
  };

  const user = useSelector(selectUser);
  const [posts, setPosts] = useState<PostObj[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const guitarPosts = postsFilter("guitar");
  const bassPosts = postsFilter("bass");

  const handleOpen = (): void => {
    setOpenModal(true);
  };

  useEffect(() => {
    const syncPosts = db
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
            userID: doc.data().userID,
            likeCount: doc.data().likeCount,
            likedUser: doc.data().likedUser,
          }))
        )
      );
    return () => {
      syncPosts();
    };
  }, []);

  return (
    <>
      <div className="text-[36px] leading-none text-center">
        <p>my new gear...</p>
        <p className="mt-[15px] md:leading-[1.2]">
          あなたの素敵な機材を共有しませんか
        </p>
        <button className={classes.btn} onClick={handleOpen}>
          <svg width="277" height="62">
            <defs>
              <linearGradient id="grad1">
                <stop offset="0%" stopColor="#FF8282" />
                <stop offset="100%" stopColor="#E178ED" />
              </linearGradient>
            </defs>
            <rect
              x="5"
              y="5"
              rx="25"
              fill="none"
              stroke="url(#grad1)"
              width="266"
              height="50"
            ></rect>
          </svg>
          <span>my new gear を投稿</span>
        </button>
      </div>
      {user.uid ? (
        <PostInput openModal={openModal} setOpenModal={setOpenModal} />
      ) : (
        <Auth openModal={openModal} setOpenModal={setOpenModal} />
      )}

      {posts[0]?.id && (
        <section className="mt-[20px] md:mt-[25px]">
          <h2 className="text-[18px]">#mynewgear</h2>
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
      {guitarPosts[0]?.id && (
        <section className="mt-[30px] mb-[30px]">
          <h2 className="text-[18px]">#guitar</h2>
          <ul className="flex flex-wrap mx-[-5px]">
            {guitarPosts.map((post) => (
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
      {bassPosts[0]?.id && (
        <section className="mt-[30px] mb-[30px] md:mb-[0px]">
          <h2 className="text-[18px]">#bass</h2>
          <ul className="flex flex-wrap mx-[-5px]">
            {bassPosts.map((post) => (
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
    </>
  );
};

export default MainPage;
