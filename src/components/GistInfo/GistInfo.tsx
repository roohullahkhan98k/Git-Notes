import React, { useState } from 'react';
import styles from './GistInfo.module.css';
import GistActions from '../GistActions/GistActions';
import { useQuery, useQueries, useQueryClient,useMutation } from 'react-query';
import { fetchGists, fetchStarredGists, fetchRawContent, deleteGist, starGist, unstarGist,formatGists } from '../../utils/gistHelper';
import { formatTime } from '../../utils/timeFormatter';
import { useDispatch } from 'react-redux';
import { setSelectedGist } from '../../Redux/gistSlice';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Props {
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  isStarred?: boolean;
}

const GistInfo: React.FC<Props> = ({ currentPage,pageSize,handlePageChange,handlePageSizeChange,isStarred = false,
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery(
    ['gists', currentPage, pageSize, isStarred],
    () => {
      if (isStarred) {
        return fetchStarredGists(currentPage, pageSize);
      } else {
        return fetchGists(currentPage, pageSize, true);
      }
    },
    {
      keepPreviousData: true,
    }
  );

  const rawContentQueries = useQueries(
    data?.map((gist) => ({
      queryKey: ['rawContent', gist.files[Object.keys(gist.files)[0]].raw_url],
      queryFn: () => fetchRawContent(gist.files[Object.keys(gist.files)[0]].raw_url),
      keepPreviousData: false,
    })) || []
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCardClick = (gist: any) => {
    const formattedGist = { ...gist, updatedAt: gist.updated_at };
    dispatch(setSelectedGist(formattedGist));
    navigate(`/details/${gist.id}`);
  };

  const { mutateAsync: deleteGistMutate } = useMutation(
    async (gistId: string) => {
      await deleteGist(gistId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['gists', currentPage, pageSize, isStarred]);
      },
    }
  );
  
  const handleDelete = async (gistId: string) => {
    try {
      await deleteGistMutate(gistId);
      const updatedData = data?.filter((gist) => gist.id !== gistId);
      queryClient.setQueryData(['gists', currentPage, pageSize, isStarred], updatedData);
      setSuccessMessage('Gist deleted successfully!');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { /* empty */ } finally {
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    }
  };
  const handleStar = async (gistId: string) => {
    await starGist(gistId);
    queryClient.invalidateQueries(['gists', currentPage, pageSize, isStarred]);
  };

  const handleUnstar = async (gistId: string) => {
    await unstarGist(gistId);
    queryClient.invalidateQueries(['gists', currentPage, pageSize, isStarred]);
    setSuccessMessage('Gist unstarred successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleStarClick = async (gistId: string) => {
    if (isStarred) {
      await handleUnstar(gistId);
    } else {
      await handleStar(gistId);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className={styles.rightContainer}>
      <h1 className={styles.heading}>{isStarred ? 'Starred Gists' : 'Your Gists'}</h1>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <div className={styles.cardContainer}>
        {data?.map((gist, index) => (
          <div
            key={gist.id}
            className={styles.card}
            onClick={() => handleCardClick(gist)}
          >
            <div className={styles.upperDiv}>
              <div className={styles.innerContent}>
                <div>
                  {rawContentQueries[index]?.data ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: rawContentQueries[index].data,
                      }}
                    />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.lowerDiv}>
              <div className={styles.ownerInfoAndStats}>
                <div className={styles.ownerInfo}>
                  <img
                    src={gist.owner.avatar_url}
                    alt={gist.owner.login}
                    style={{ width: 36, height: 36, borderRadius: '50%' }}
                  />
                                    <span style={{ marginLeft: 8, color: '#003B44', fontWeight: 400, fontSize: 14 }}>
                    {gist.owner.login}
                  </span>
                  <span style={{ marginLeft: 4, color: '#003B44', fontWeight: 600 }}>
                    /{Object.keys(gist.files)[0]}
                  </span>
                </div>
                <div className={styles.stats}>
                  <GistActions
                    gist={formatGists([gist])[0]}
                    onForkClick={() => {}}
                    onStarClick={() => handleStarClick(gist.id)}
                    onDeleteClick={() => handleDelete(gist.id)}
                    showDelete={!isStarred}
                    isStarred={isStarred}
                  />
                </div>
              </div>
              <div className={styles.UpdatedandDescription}>
                <span style={{ color: '#666', fontSize: 14 }}>
                  Updated {formatTime(gist.updated_at)}
                </span>
                <p style={{ color: '#666', fontSize: 14 }}>{gist.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <Pagination
          pageSize={pageSize}
          pageSizeOptions={['2', '4', '6']}
          showSizeChanger={true}
          onShowSizeChange={(_current: unknown, size: number) => handlePageSizeChange(size)}
          total={100}
          current={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default GistInfo;