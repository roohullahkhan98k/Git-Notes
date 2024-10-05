import styles from './DetailPage.module.css';
import Detail from '../../components/Detail/Detail';

const DetailPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Detail />
    </div>
  );
};

export default DetailPage;