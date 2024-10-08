import { FC } from 'react';
import styles from './Header.module.css';
import { Dropdown } from 'antd';
import { DropdownProps } from '../../models/interfaces';
import { Link } from 'react-router-dom';

const DropdownComponent: FC<DropdownProps> = ({ user, handleSignOut }) => {
  const menu = (
    <div className={styles.dropdown} style={{ backgroundColor: 'white' }}>
      <p style={{ color: 'black' }}>Signed in as</p>
      <p style={{ color: 'black', fontWeight: 'bold' }}>{user.displayName}</p>
      <Link to="/create-gist" style={{ color: 'black', cursor: 'pointer', display: 'block' }}>
        Create Gist
      </Link>
      <Link to="/starred-gist" style={{ color: 'black', cursor: 'pointer', display: 'block' }}>
        Starred Gist
      </Link>
      <Link to="/profile" style={{ color: 'black', cursor: 'pointer', display: 'block' }}>
        Your GitHub Profile
      </Link>
      <p style={{ color: 'black', cursor: 'pointer' }} onClick={handleSignOut}>
        Sign Out
      </p>
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <img
        src={user.photoURL || '/profile.png'}
        alt="Profile Picture"
        className={styles['profile-pic']}
      />
    </Dropdown>
  );
};

export default DropdownComponent;