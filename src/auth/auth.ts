/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import app from '../../firebase';

const provider = new GithubAuthProvider();
provider.addScope("gist");
const auth = getAuth(app);

const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    if (credential !== null) {
      const token = credential.accessToken;
      // Use the token if needed
    }
    const user = result.user;
    return user;
  } catch (error) {
    console.error(error);
  }
};

export { loginWithGithub };