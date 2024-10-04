import styles from './Header.module.css';
import logo from '../../assets/Emumba Logo .png';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { FC } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void; // Add prop for search functionality
}

const Header: FC<HeaderProps> = ({ onSearch }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value); // Trigger onSearch when user types in search bar
  };

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
            onChange={handleSearch} // Handle input changes
          />
          <Button className={styles['login-btn']}>Login</Button>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
