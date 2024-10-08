import { useState, useCallback } from 'react';
import { message } from 'antd';
import { starGist } from '../utils/gistHelper';
import { FormattedGist } from '../models/interfaces';

const useStarGist = (gist: FormattedGist) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStarClick = useCallback(() => {
    setLoading(true);
    setError('');

    starGist(gist.key)
      .then(() => {
        message.success(`Gist ${gist.key} starred successfully`);
        console.log(`Gist ${gist.key} starred successfully`);
      })
      .catch((error) => {
        setError(error.message);
        console.error(`Error starring gist ${gist.key}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gist]);

  return { handleStarClick, loading, error };
};

export default useStarGist;