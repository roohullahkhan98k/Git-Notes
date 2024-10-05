import { FC } from 'react';
import styles from './Header.module.css';
import { Dropdown } from 'antd';
import { DropdownProps } from '../../models/interfaces';

const DropdownComponent: FC<DropdownProps> = ({ user, handleSignOut }) => {
  const menu = (
    <div className={styles.dropdown} style={{ backgroundColor: 'white' }}>
      <p style={{ color: 'black' }}>Signed in as</p>
      <p style={{ color: 'black', fontWeight: 'bold' }}>{user.displayName}</p>
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