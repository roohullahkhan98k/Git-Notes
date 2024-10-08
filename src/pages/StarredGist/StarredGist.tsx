import React from 'react';
import styles from './StarredGist.module.css';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import GistInfo from '../../components/GistInfo/GistInfo';
import { User } from '../../models/interfaces';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../../firebase';

const auth = getAuth(app);

const StarredGist: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(2);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as User | null);
    });
    return unsubscribe;
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  return (
    <div className={styles.StarredContainer}>
      <ProfileInfo user={user} />
      <GistInfo
        currentPage={currentPage}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        isStarred={true} 
      />
    </div>
  );
};

export default StarredGist;