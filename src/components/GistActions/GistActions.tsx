import React from 'react';
import { ForkOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './GistActions.module.css';
import { FormattedGist } from '../../models/interfaces';

interface GistActionsProps {
  gist: FormattedGist;
  onForkClick: () => void;
  onStarClick: () => void;
  onDeleteClick?: () => void;
  showDelete?: boolean;
  disabled?: boolean;
  error?: string;
  isStarred?: boolean;
}

const GistActions: React.FC<GistActionsProps> = ({
  onForkClick,
  onStarClick,
  onDeleteClick,
  showDelete = false,
  disabled = false,
  error = '',
  isStarred = false,
}) => {
  const handleFork = (event: React.MouseEvent) => {
    event.stopPropagation();
    onForkClick();
  };

  const handleStar = (event: React.MouseEvent) => {
    event.stopPropagation();
    onStarClick();
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteClick?.();
  };

  return (
    <div className={styles.actions}>
      <ForkOutlined style={{ fontSize: 20 }} onClick={handleFork} />
      <StarOutlined
        style={{
          fontSize: 20,
          color: isStarred ? 'yellow' : '',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={disabled ? undefined : handleStar}
      />
      {showDelete && onDeleteClick && (
        <DeleteOutlined
          style={{
            fontSize: 20,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onClick={disabled ? undefined : handleDelete}
        />
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default GistActions;