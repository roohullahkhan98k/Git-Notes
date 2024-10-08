import styles from './Header.module.css';
import logo from '../../assets/Emumba Logo .png';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { FC, useState, useEffect,useCallback } from 'react';
import { HeaderProps, User } from '../../models/interfaces';
import { loginWithGithub } from '../../auth/auth';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../../../firebase';
import DropdownComponent from './DropdownComponent';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);

const Header: FC<HeaderProps> = ({ onSearch }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as User | null);
    });
    return unsubscribe;
  }, []);

  const handleLogin = useCallback(async () => {
    const loggedInUser = await loginWithGithub();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut(auth);
    console.log('User logged out:', auth.currentUser);
    setUser(null);
    navigate('/');
  }, [navigate]);


  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles['logo-container']}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        <div className={styles['search-container']}>
          <Input
            className={styles['search-bar']}
            placeholder="Search for Gists"
            prefix={<SearchOutlined className={styles['search-icon']} />}
            onChange={handleSearch}
          />
          {user ? (
            <DropdownComponent user={user} handleSignOut={handleSignOut} />
          ) : (
            <Button className={styles['login-btn']} onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;