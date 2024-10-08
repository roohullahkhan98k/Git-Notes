import React from 'react';
import styles from './ProfileInfo.module.css';
import { User } from '../../models/interfaces';

interface Props {
  user: User | null;
}

const ProfileInfo: React.FC<Props> = ({ user }) => {
  return (
    <div className={styles.leftContainer}>
      {user?.photoURL && (
        <img
          src={user.photoURL}
          alt="Profile Picture"
          className={styles.profilePicture}
          loading="lazy"
        />
      )}
      {user?.displayName && (
        <h2 className={styles.profileName}>{user.displayName}</h2>
      )}
      {user && (
        <button className={styles.viewProfileButton}>
          <a
            href={`https://github.com/${user.displayName}`}
            target="_blank"
            rel="noreferrer"
          >
            View Your GitHub Profile
          </a>
        </button>
      )}
    </div>
  );
};

export default ProfileInfo;