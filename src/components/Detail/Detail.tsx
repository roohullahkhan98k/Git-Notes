import { useSelector } from 'react-redux';
import styles from './Detail.module.css';
import { RootState } from '../../Redux/store';
import { formatTime } from '../../utils/timeFormatter';
import { Card, Space } from 'antd';
import { ForkOutlined, StarOutlined } from '@ant-design/icons';

const Detail: React.FC = () => {
  const selectedGist = useSelector((state: RootState) => state.gist.selectedGist);

  if (!selectedGist) {
    return <div>No Gist Selected</div>;
  }

  return (
    <div className={styles.detailContainer}>
      {/* Upper Div */}
      <div className={styles.upperDiv}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={selectedGist.owner.avatar_url}
              alt={selectedGist.owner.login}
              style={{ width: 50, height: 50, borderRadius: '50%' }}
            />
            <span style={{ marginLeft: 10, fontWeight: 400, marginTop: -35 }}>
              {selectedGist.owner.login} 
            </span>
            <span style={{ marginLeft: 10, fontWeight: 400, color: '#003B44', marginTop: -35 }}>/</span>
            <span style={{ marginLeft: 10, fontWeight: 700, color: '#003B44', marginTop: -35 }}>
              {selectedGist.gistName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#7A7A7A' }}>
            <Space size={10}>
              <ForkOutlined style={{ fontSize: 25 }} />
              <StarOutlined style={{ fontSize: 25 }} />
            </Space>
          </div>
        </div>
        <div style={{ marginLeft: 58, color: '#7A7A7A', fontSize: 14, marginTop: -30 }}>
          <p>Updated: {formatTime(selectedGist.updatedAt)}</p>
          <p>
            {selectedGist.description ? 
              selectedGist.description : 
              'No description'}
          </p>
        </div>
      </div>

      {/* Middle and Lower Divs */}
      <Card className={styles.mainContainer} bodyStyle={{ padding: 0 }}>
        {/* Middle Div */}
        <div className={styles.middleDiv}>
          <p>{selectedGist.gistName}</p>
        </div>

        {/* Lower Div */}
        <div className={styles.lowerDiv}>
          <div dangerouslySetInnerHTML={{ __html: selectedGist.rawContent }} />
        </div>
      </Card>
    </div>
  );
};

export default Detail;