import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

const MyPage: React.FC = () => {
  const user = useSelector(selectUser);
  const [likePosts, setLikePosts] = useState<string[]>([]);
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
      bookmarkCount: 0,
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
            bookmarkCount: doc.data().bookmarkCount,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, []);

  // TODO: postの方の処理と一緒にできる？
  // ログインユーザーのいいねした投稿をDBから取得
  useEffect(() => {
    const posts_like: string[] = [];
    db.collection("users")
      .doc(user.uid)
      .collection("likePosts")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc) {
            posts_like.push(doc.id);
            console.log("posts_like1:", posts_like);
            setLikePosts(posts_like);
          } else {
            console.log("いいねした投稿:No such document!");
            // setLikeState(false);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("posts_like2:", posts_like);
    for (let index = 0; index < posts_like.length; index++) {
      const element = posts_like[index];
      console.log("element:", element);
    }
  }, [posts]);

  // useEffect(() => {
  //   const test = posts.filter((post) => {
  //     console.log("post:", post);
  //   });
  // }, [likePosts]);
  // const test = likePosts[0]
  // const test = likePosts.forEach((doc) => {
  // const test = posts.filter((post) => {
  // console.log("post.id:", post.id);
  // console.log("doc", doc);
  // console.log(post.id === doc);
  // const likeArray: string[] = [];
  // console.log("---------------");
  // likePosts.forEach((doc) => {
  //   likeArray.push(doc);
  // });
  // console.log(likeArray);
  // console.log("---------------");
  // for (let index = 0; index < posts.length; index++) {
  //   console.log("index:", index);
  // }
  // const element = array[index];
  // const test1 = post.id === likePosts[0];
  // const test2 = post.id === likePosts[1];
  // return [test1, test2];
  // }
  // });
  // console.log("posts:", posts);
  // console.log("test:", test);
  // return test;
  // console.log(test);
  // });

  // const test = likePosts.forEach((doc) => {
  //   const result = posts.filter((post) => {
  //     // console.log(post.id === doc);
  //     return post.id === doc;
  //   });
  //   return result;
  // });
  // console.log(test);

  // const posts_filter = (cat: string) => {
  //   const result = posts.filter((post) => {
  //     return post.category === cat;
  //   });
  //   return result;
  // };

  // const posts_guitar = posts_filter("guitar");
  // const posts_bass = posts_filter("bass");

  return (
    <>
      <section className="mt-5">
        <h2 className="text-lg">いいねした投稿</h2>
        {/* {test[0]?.id && (
          <ul className="flex flex-wrap -m-2 mt-0">
            {test.map((post) => (
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
              />
            ))}
          </ul>
        )} */}
      </section>
    </>
  );
};

export default MyPage;
