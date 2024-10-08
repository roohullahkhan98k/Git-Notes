import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import app from '../../firebase';
import { User } from '../models/interfaces'

const provider = new GithubAuthProvider();
provider.addScope("gist");
provider.addScope("repo");
const auth = getAuth(app);

const loginWithGithub = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    if (credential !== null) {
      const token = credential.accessToken;
      // Check if token is not undefined before storing
      if (token) {
        // Store the token in local storage
        localStorage.setItem('githubToken', token);
      } else {
        console.error('GitHub token is undefined');
      }
    }
    const user = result.user;
    return {
      photoURL: user.photoURL,
      displayName: user.displayName,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { loginWithGithub };