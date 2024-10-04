import { useState } from 'react';
import styles from './LandingPage.module.css';
import Toggle from '../components/toggle/toogle'; 
import List from '../components/List/List';
import Card from '../components/Card/Card'; 

interface LandingPageProps {
  searchQuery: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ searchQuery }) => {
  const [view, setView] = useState<'list' | 'card'>('list');

  const handleToggle = (view: 'list' | 'card') => {
    setView(view);
  };

  return (
    <div className={styles.container}>
      <Toggle onToggle={handleToggle} />
      {view === 'list' ? <List searchQuery={searchQuery} /> : <Card searchQuery={searchQuery} />}
    </div>
  );
};

export default LandingPage;
