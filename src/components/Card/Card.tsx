import { useCallback, useState } from 'react';
import { message, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './Card.module.css';
import { useQuery, useQueries } from 'react-query';
import {fetchGists, filterGists,formatGists, fetchRawContent, starGist} from '../../utils/gistHelper';
import { CardProps, FormattedGist } from '../../models/interfaces';
import GistActions from '../GistActions/GistActions';
import { formatTime } from '../../utils/timeFormatter';
import { useDispatch } from 'react-redux';
import { setSelectedGist } from '../../Redux/gistSlice';

const Card: React.FC<CardProps> = ({ searchQuery, isAuthenticated }) => {
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(6);
const [starLoading, setStarLoading] = useState<Record<string, boolean>>({});
const [starError, setStarError] = useState<Record<string, string>>({});

const navigate = useNavigate();

const { data, error, isLoading } = useQuery(
['gists', currentPage, pageSize, isAuthenticated],
() => fetchGists(currentPage, pageSize, isAuthenticated),
{
keepPreviousData: true,
}
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

const handlePageChange = useCallback((page: number) => {
setCurrentPage(page);
}, []);

const handlePageSizeChange = useCallback((pageSize: number) => {
setPageSize(pageSize);
setCurrentPage(1);
}, []);

const handleCardClick = useCallback((gist: FormattedGist, rawContent: string) => {
dispatch(setSelectedGist({ ...gist, rawContent }));
navigate(`/details/${gist.key}`);
}, [dispatch, navigate]);

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
{formattedData?.map((gist, index) => {
const rawContentQuery = rawContentQueries[index];

return (
<div
key={gist.key}
className={styles.card}
onClick={() => handleCardClick(gist, rawContentQuery?.data ?? '')}
>
<div className={styles.upperDiv} style={{ height: '60%' }}>
<div className={styles.innerContent}>
{rawContentQuery?.isLoading ? (
<div>Loading...</div>
) : (
<div dangerouslySetInnerHTML={{ __html: rawContentQuery?.data ?? '' }} />
)}
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
/{gist.gistName}
</span>
</div>
<div className={styles.stats}>
<GistActions
gist={gist}
onStarClick={() => handleStarClick(gist)}
disabled={starLoading[gist.key]}
error={starError[gist.key]} onForkClick={function (): void {
throw new Error('Function not implemented.');
} } />
</div>
</div>
<div className={styles.UpdatedandDescription}>
<span style={{ color: '#666', fontSize: 14 }}>
Updated {formatTime(gist.updatedAt)}
</span>
<p style={{ color: '#666', fontSize: 14 }}>{gist.description}</p>
</div>
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