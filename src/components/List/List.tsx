import React, { useState, useCallback } from 'react';
import { Table,message} from 'antd';
import { useQuery, useQueries } from 'react-query';
import { fetchGists, fetchRawContent, filterGists, formatGists, starGist } from '../../utils/gistHelper';
import { FormattedGist, ListProps } from '../../models/interfaces';
import styles from './List.module.css';
import GistActions from '../GistActions/GistActions';
import { formatTime } from '../../utils/timeFormatter';
import { useDispatch } from 'react-redux';
import { setSelectedGist } from '../../Redux/gistSlice';
import { useNavigate } from 'react-router-dom';

const List: React.FC<ListProps> = ({ searchQuery, isAuthenticated }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [starLoading, setStarLoading] = useState<Record<string, boolean>>({});
  const [starError, setStarError] = useState<Record<string, string>>({});

  const { data, error, isLoading } = useQuery(
    ['gists', currentPage, pageSize, isAuthenticated],
    () => fetchGists(currentPage, pageSize, isAuthenticated),
    { keepPreviousData: true }
  );

  const filteredData = filterGists(data || [], searchQuery);
  const formattedData = formatGists(filteredData);

  const rawContentQueries = useQueries(
    formattedData?.map((gist) => ({
      queryKey: ['rawContent', gist.rawUrl],
      queryFn: () => fetchRawContent(gist.rawUrl),
      keepPreviousData: true,
    })) || []
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );
  
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setPageSize(pageSize);
      setCurrentPage(1); 
    },
    [setPageSize, setCurrentPage]
  );
  
  const handleRowClick = useCallback(
    (gist: FormattedGist, rawContent: string) => {
      dispatch(setSelectedGist({ ...gist, rawContent }));
      navigate(`/details/${gist.key}`);
    },
    [dispatch, navigate]
  );  
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className={styles.container}>
      <Table
        columns={[
          {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
            render: (owner) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={owner.avatar_url}
                  alt={owner.login}
                  style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                />
                <span>{owner.login}</span>
              </div>
            ),
          },
          { title: 'Gist Name', dataIndex: 'gistName', key: 'gistName' },
          { title: 'Type', dataIndex: 'type', key: 'type' },
          {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt) => <span>{formatTime(updatedAt)}</span>,
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (gist) => (
              <GistActions
                gist={gist}
                onStarClick={() => handleStarClick(gist)}
                disabled={starLoading[gist.key]}
                error={starError[gist.key]} onForkClick={function (): void {
                  throw new Error('Function not implemented.');
                } }              />
            ),
          },
        ]}
        dataSource={formattedData}
        pagination={{
          pageSize,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          onShowSizeChange: (_current, size) => handlePageSizeChange(size),
          total: 100,
          current: currentPage,
          onChange: handlePageChange,
        }}
        onRow={(record, index) => {
          if (index !== undefined) {
            const rawContentQuery = rawContentQueries[index];
            return {
              onClick: () => handleRowClick(record, rawContentQuery?.data ?? ''),
            };
          }
          return {};
        }}
      />
    </div>
  );
};

export default List;