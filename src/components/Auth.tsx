import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  TextField,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, google_provider, storage, twitter_provider } from "../firebase";
import styles from "./Auth.module.css";

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
  // const [openModal, setOpenModal] = useState(false);
  // const [resetEmail, setResetEmail] = useState("");
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  // TODO:リセットメールのモーダルと競合している 別モーダルにして対応
  // const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
  //   await auth
  //     .sendPasswordResetEmail(resetEmail)
  //     .then(() => {
  //       setOpenModal(false);
  //       setResetEmail("");
  //     })
  //     .catch((err) => {
  //       alert(err.message);
  //       setResetEmail("");
  //     });
  // };
  const signInTwitter = async () => {
    await auth
      .signInWithPopup(twitter_provider)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => alert(err.message));
  };
  const signInGoogle = async () => {
    await auth
      .signInWithPopup(google_provider)
      .catch((err) => alert(err.message));
  };
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
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
    // TODO:背景にブラーかけるとめっちゃいい
    <Modal
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="backdrop-blur-[20px] mr-[15px]"
    >
      <Fade in={openModal}>
        <div className="relative bg-white border rounded-2xl py-[40px] px-[40px] flex items-center justify-center w-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[90%]">
          <div>
            <p className="text-center text-[24px]">
              {isLogin ? "ログイン" : "新規登録"}
            </p>
            <form className={classes.form} noValidate>
              {!isLogin && (
                <>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <Box textAlign="center">
                    <IconButton>
                      <label>
                        <AccountCircleIcon
                          fontSize="large"
                          className={
                            avatarImage
                              ? styles.login_addIconLoaded
                              : styles.login_addIcon
                          }
                        />
                        <input
                          className={styles.login_hiddenIcon}
                          type="file"
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
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
                label="Password"
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
                {isLogin ? "Login" : "Register"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <span
                    className={styles.login_reset}
                    onClick={() => setOpenModal(true)}
                  >
                    Forgot password ?
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className={styles.login_toggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Create new account ?" : "Back to login"}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="default"
                className={classes.submit}
                startIcon={<CameraIcon />}
                onClick={signInTwitter}
              >
                SignIn with Twitter
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="default"
                className={classes.submit}
                startIcon={<CameraIcon />}
                onClick={signInGoogle}
              >
                SignIn with Google
              </Button>
            </form>

            {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div style={getModalStyle()} className={classes.modal}>
                  <div className={styles.login_modal}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      type="email"
                      name="email"
                      label="Reset E-mail"
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
              </Modal> */}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
export default Auth;
