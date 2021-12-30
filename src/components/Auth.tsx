import {
  Backdrop,
  Button,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  TextField,
} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import SendIcon from "@material-ui/icons/Send";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, google_provider, storage, twitter_provider } from "../firebase";
import IconGoogle from "../img/icon_google.png";
import { ReactComponent as IconTwitter } from "../img/icon_twitter.svg";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1581784368651-8916092072cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  twitter: {
    margin: theme.spacing(3, 0, 0),
    textTransform: "none",
    backgroundColor: "#5AABF3",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgba(90, 171, 243, 0.7)",
    },
  },
  google: {
    margin: theme.spacing(2, 0, 0),
    textTransform: "none",
    backgroundColor: "#4285f4",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgba(66, 133, 244, 0.7)",
    },
  },
}));

const Auth: React.FC<{
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ openModal, setOpenModal }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [resetEmailOpenModal, setResetEmailOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [preview, setPreview] = useState("");
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      setPreview(window.URL.createObjectURL(e.target.files![0]));
      e.target.value = "";
    }
  };
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setResetEmailOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };
  const signInTwitter = async () => {
    await auth
      .signInWithPopup(twitter_provider)
      .then((res) => {
        setOpenModal(false);
        console.log(res);
      })
      .catch((err) => alert(err.message));
  };
  const signInGoogle = async () => {
    await auth
      .signInWithPopup(google_provider)
      .then((res) => {
        setOpenModal(false);
        console.log(res);
      })
      .catch((err) => alert(err.message));
  };
  const signInEmail = async () => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setOpenModal(false);
        console.log(res);
      })
      .catch((err) => alert(err.message));
  };
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="backdrop-blur-[20px] mr-[15px] lg:mr-0"
    >
      <Fade in={openModal}>
        <div className="relative bg-white border rounded-[16px] py-[40px] px-[40px] flex items-center justify-center w-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[90%] md:px-[30px] md:py-[30px]">
          <div>
            <p className="text-center text-[24px]">
              {isLogin ? "ログイン" : "新規登録"}
            </p>
            <form className={classes.form} noValidate>
              {!isLogin && (
                <>
                  <div className="flex items-center justify-center">
                    <Button type="button" variant="contained" color="primary">
                      <label className="text-white cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="opacity-0 hidden absolute appearance-none"
                          onChange={onChangeImageHandler}
                        />
                        アイコン画像アップロード
                      </label>
                    </Button>
                    {preview && (
                      <img
                        src={preview}
                        alt=""
                        className="w-[50px] h-[50px] rounded-full ml-[10px]"
                      />
                    )}
                  </div>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="ユーザー名"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value);
                    }}
                  />
                </>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />

              <Button
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !avatarImage
                }
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                startIcon={<EmailIcon />}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await signInEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                }
              >
                {isLogin ? "ログイン" : "登録"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <span
                    className="cursor-pointer"
                    onClick={() => setResetEmailOpenModal(true)}
                  >
                    パスワードを
                    <br className="hidden md:block" />
                    忘れた方
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className="cursor-pointer text-blue"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "アカウントを新規作成" : "ログインに戻る"}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="default"
                className={classes.twitter}
                onClick={signInTwitter}
              >
                <span className="w-[20px] mr-[5px]">
                  <IconTwitter />
                </span>
                Twitterでログイン
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="default"
                className={classes.google}
                onClick={signInGoogle}
              >
                <span className="w-[25px] mr-[5px]">
                  <img src={IconGoogle} alt="" />
                </span>
                Googleでログイン
              </Button>
            </form>

            <Modal
              open={resetEmailOpenModal}
              onClose={() => setResetEmailOpenModal(false)}
            >
              <div style={getModalStyle()} className={classes.modal}>
                <div className="text-center">
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="email"
                    name="email"
                    label="メールアドレスを入力"
                    value={resetEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setResetEmail(e.target.value);
                    }}
                  />
                  <IconButton onClick={sendResetEmail}>
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
export default Auth;
