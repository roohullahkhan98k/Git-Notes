import { useSelector } from 'react-redux';
import styles from './Detail.module.css';
import { RootState } from '../../Redux/store';
import { formatTime } from '../../utils/timeFormatter';
import { Card, message, Space } from 'antd';
import GistActions from '../GistActions/GistActions';
import { useCallback, useState } from 'react';
import { FormattedGist } from '../../models/interfaces';
import { starGist } from '../../utils/gistHelper';

const Detail: React.FC = () => {
  const selectedGist = useSelector((state: RootState) => state.gist.selectedGist);
  const [starLoading, setStarLoading] = useState<Record<string, boolean>>({});
  const [starError, setStarError] = useState<Record<string, string>>({});






  const handleStarClick = useCallback((gist: FormattedGist) => {
    setStarLoading((prevLoading) => ({ ...prevLoading, [gist.key]: true }));
    setStarError((prevError) => ({ ...prevError, [gist.key]: '' }));
  
    starGist(gist.key)
      .then(() => {
        message.success(`Gist ${gist.key} starred successfully`);
        console.log(`Gist ${gist.key} starred successfully`);
      })
      .catch((error) => {
        setStarError((prevError) => ({ ...prevError, [gist.key]: error.message }));
        console.error(`Error starring gist ${gist.key}:`, error);
      })
      .finally(() => {
        setStarLoading((prevLoading) => ({ ...prevLoading, [gist.key]: false }));
      });
  }, []);

  if (!selectedGist) {
    return <div>No Gist Selected</div>;
  }

  return (
    <div className={styles.detailContainer}>
      
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
            <GistActions
  gist={selectedGist}
  onStarClick={() => handleStarClick(selectedGist)}
  disabled={starLoading[selectedGist.key]}
  error={starError[selectedGist.key]}
  onForkClick={() => console.log(`Fork clicked for gist ${selectedGist.key}`)}
/>
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

      
      <Card className={styles.mainContainer} bodyStyle={{ padding: 0 }}>
        <div className={styles.middleDiv}>
          <p>{selectedGist.gistName}</p>
        </div>
        <div className={styles.lowerDiv}>
          <div dangerouslySetInnerHTML={{ __html: selectedGist.rawContent }} />
        </div>
      </Card>
    </div>
  );
};

export default Detail;