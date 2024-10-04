import React from 'react';
import { Pagination } from 'antd';
import styles from './Card.module.css';
import { useQuery, useQueries } from 'react-query';
import { Gist } from '../../models/interfaces';
import ApiEndpoints from '../../models/api.enum';


interface CardProps {
  searchQuery: string; // Add search query as a prop
}

const token = import.meta.env.VITE_GITHUB_TOKEN;

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

const fetchRawContent = async (rawUrl: string): Promise<string> => {
  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body.innerHTML;

  return body;
};

const Card: React.FC<CardProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6); 
  const { data, error, isLoading } = useQuery(
    ['gists', currentPage, pageSize],
    () => fetchGists(currentPage, pageSize),
    {
      keepPreviousData: true,
    }
  );
  const filteredData = data?.filter((gist: Gist) => 
    gist.owner.login.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formattedData = filteredData?.map((gist: Gist) => ({
    key: gist.id,
    owner: gist.owner,
    gistName: Object.keys(gist.files)[0],
    rawUrl: Object.values(gist.files)[0].raw_url,
    type: gist.public ? 'Public' : 'Private',
    updatedAt: gist.updated_at,
  }));

  const rawContentQueries = useQueries(
    formattedData?.map((gist) => ({
      queryKey: ['rawContent', gist.rawUrl],
      queryFn: () => fetchRawContent(gist.rawUrl),
      keepPreviousData: true,
    })) || []
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className={styles.container}>
      {formattedData?.map((gist, index) => {
        const rawContentQuery = rawContentQueries[index];

        return (
          <div
            key={gist.key}
            className={styles.card}
          >
            <div className={styles.upperDiv} style={{ height: '60%' }}>
              {rawContentQuery?.isLoading ? (
                <div>Loading...</div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: rawContentQuery?.data ?? '' }} />
              )}
            </div>
            <div className={styles.lowerDiv}>
              <div className={styles.ownerInfo}>
                <img src={gist.owner.avatar_url} alt={gist.owner.login} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <span style={{ marginLeft: 8 }}>{gist.owner.login}</span>
              </div>
              <h4>{gist.gistName}</h4>
            </div>
          </div>
        );
      })}
      <div className={styles.pagination}>
        <Pagination
          pageSize={pageSize}
          pageSizeOptions={['6', '12', '18', '24']} 
          showSizeChanger={true}
          onShowSizeChange={(_current, size) => handlePageSizeChange(size)}
          total={100}
          current={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Card;