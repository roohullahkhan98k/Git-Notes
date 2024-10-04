import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB-3SCUdMrxA9b1ZmRMBMSvjjt5hLhdiNM',
  authDomain: 'git-notes-fca41.firebaseapp.com',
  projectId: 'git-notes-fca41',
};

const app = initializeApp(firebaseConfig);

export default app;