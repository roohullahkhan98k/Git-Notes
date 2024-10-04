import { Table } from 'antd';
import { useQuery } from 'react-query';
import styles from './List.module.css';
import { useState } from 'react';
import { Owner, Gist } from '../../models/interfaces';
import ApiEndpoints from '../../models/api.enum';
import { ForkOutlined, StarOutlined } from '@ant-design/icons';

interface ListProps {
  searchQuery: string; 
}

const token = import.meta.env.VITE_GITHUB_TOKEN;

const columns = [
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    render: (owner: Owner) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src={owner.avatar_url} 
          alt={owner.login} 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            marginRight: 8 
          }} 
        />
        <span>{owner.login}</span>
      </div>
    ),
  },
  {
    title: 'Gist Name',
    dataIndex: 'gistName',
    key: 'gistName',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <div className={styles.actions}>
        <ForkOutlined style={{ fontSize: 20 }} />
        <StarOutlined style={{ fontSize: 20 }} />
      </div>
    ),
  },
];

const fetchGists = async (page: number, pageSize: number): Promise<Gist[]> => {
  const response = await fetch(`${ApiEndpoints.GISTS}?per_page=${pageSize}&page=${page}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

const List: React.FC<ListProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { data, error, isLoading } = useQuery(
    ['gists', currentPage, pageSize],
    () => fetchGists(currentPage, pageSize),
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const filteredData = data?.filter((gist: Gist) => 
    gist.owner.login.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formattedData = filteredData?.map((gist: Gist) => ({
    key: gist.id,
    owner: gist.owner,
    gistName: Object.keys(gist.files)[0],
    type: gist.public ? 'Public' : 'Private',
    updatedAt: gist.updated_at,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
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
      />
    </div>
  );
};

export default List;