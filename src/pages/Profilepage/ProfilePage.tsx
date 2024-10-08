import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import GistInfo from '../../components/GistInfo/GistInfo';
import { User } from '../../models/interfaces';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../../firebase';

const auth = getAuth(app);

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  useEffect(() => {
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
    <div className={styles.profileContainer}>
      <ProfileInfo user={user} />
      <GistInfo
        currentPage={currentPage}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ProfilePage;