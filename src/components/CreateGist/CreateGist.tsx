import React, { useState, useCallback } from 'react';
import { Input, Form, Button, message } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import { createGist } from '../../utils/gistHelper';
import styles from './CreateGist.module.css';
import { DeleteOutlined } from '@ant-design/icons';

const CreateGist: React.FC = () => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([{ fileName: '', content: '' }]);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(createGist, {
    onSuccess: () => {
      queryClient.invalidateQueries('gists', { refetchActive: true, refetchInactive: true });
      message.success('Gist created successfully!');
    },
    onError: (error: unknown) => {
      setError((error as Error).message);
      message.error((error as Error).message);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!description || files.some((file) => !file.fileName || !file.content)) {
      setError('Please fill in all fields');
      return;
    }

    const gistData = {
      description,
      public: false,
      files: files.reduce((acc, file) => ({ ...acc, [file.fileName]: { content: file.content } }), {}),
    };

    mutate(gistData);
    setDescription('');
    setFiles([{ fileName: '', content: '' }]);
  }, [description, files, mutate]);

  const handleAddFile = useCallback(() => {
    setFiles((prevFiles) => [...prevFiles, { fileName: '', content: '' }]);
  }, []);

  const handleDelete = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Gist</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.customInput}
        placeholder="This is the Git Description"
        style={{ marginBottom: 20 }}
      />
      <Form layout="vertical" onFinish={handleSubmit} className={styles.form}>
        {files.map((file, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                value={file.fileName}
                onChange={(e) =>
                  setFiles((prevFiles) =>
                    prevFiles.map((f, i) => (i === index ? { ...f, fileName: e.target.value } : f))
                  )
                }
                className={styles.customInput}
                placeholder="File Name (e.g., filename.txt)"
              />
              <DeleteOutlined
                style={{
                  marginLeft: 10,
                  fontSize: 20,
                  color: 'red',
                  cursor: 'pointer',
                }}
                onClick={() => handleDelete(index)}
              />
            </div>
            <Input.TextArea
              rows={10}
              value={file.content}
              onChange={(e) =>
                setFiles((prevFiles) =>
                  prevFiles.map((f, i) => (i === index ? { ...f, content: e.target.value } : f))
                )
              }
              className={`${styles.customInput} ${styles.textArea}`}
              placeholder="Content"
            />
          </div>
        ))}
        <Form.Item>
          <div className={styles.buttonContainer}>
          <Button type="dashed" onClick={handleAddFile} style={{ marginRight: 20 }}>
          Add File
        </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.button}
              loading={isLoading}
            >
              Create Gist
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateGist;