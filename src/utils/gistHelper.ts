import { FormattedGist, Gist } from '../models/interfaces';
import ApiEndpoints from '../models/api.enum';

const githubToken = localStorage.getItem('githubToken');

export const getToken = () => githubToken;

export const fetchGists = async (
  page: number,
  pageSize: number,
  isAuthenticated: boolean
): Promise<Gist[]> => {
  const endpoint = isAuthenticated
    ? ApiEndpoints.AUTHENTICATED_GISTS 
    : ApiEndpoints.PUBLIC_GISTS; 

  const token = getToken();
  const headers: HeadersInit = isAuthenticated
    ? { 
        Authorization: `token ${token}`,
      } 
    : {};

  if (!token && isAuthenticated) {
    throw new Error('Token is undefined');
  }

  const response = await fetch(`${endpoint}?per_page=${pageSize}&page=${page}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

export const filterGists = (data: Gist[], searchQuery: string): Gist[] => {
  return data.filter((gist) =>
    gist.owner.login.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const formatGists = (data: Gist[]): FormattedGist[] => {
  return data.map((gist) => ({
    key: gist.id,
    owner: gist.owner,
    gistName: Object.keys(gist.files)[0],
    rawUrl: Object.values(gist.files)[0].raw_url,
    type: gist.public ? 'Public' : 'Private',
    updatedAt: gist.updated_at,
    description: gist.description,
    isStarred: true,
  }));
};

export const fetchRawContent = async (rawUrl: string): Promise<string> => {
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
export const createGist = async (gistData: unknown) => {
    const token = getToken();
    const endpoint = ApiEndpoints.AUTHENTICATED_GISTS;
  
    const headers = {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    };
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(gistData),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  
    return response.json();
  };

  //function to star a gist 
  export const starGist = async (gistId: string): Promise<void> => {
    const token = getToken();
    const endpoint = `https://api.github.com/gists/${gistId}/star`;
  
    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Length': '0',
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers,
      });
  
      if (response.ok) {
        console.log(`Gist ${gistId} starred successfully`);
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error starring gist ${gistId}:`, error);
    }
  };
//function to fetch a starred gist 
export const fetchStarredGists = async (
  page: number,
  pageSize: number
): Promise<Gist[]> => {
  const token = getToken();
  const headers: HeadersInit = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const response = await fetch(`${ApiEndpoints.STARRED_GISTS}?per_page=${pageSize}&page=${page}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();

  // Fetch raw content for each starred gist
  const gistsWithRawContent = await Promise.all(data.map(async (gist: { files: { [x: string]: { raw_url: string; }; }; }) => {
    const rawContent = await fetchRawContent(gist.files[Object.keys(gist.files)[0]].raw_url);
    return { ...gist, rawContent };
  }));

  return gistsWithRawContent;
};

// for delting  the gists 
export const deleteGist = async (gistId: string): Promise<void> => {
  const token = getToken();
  const endpoint = `https://api.github.com/gists/${gistId}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers,
    });

    if (response.ok) {
      console.log(`Gist ${gistId} deleted successfully`);
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting gist ${gistId}:`, error);
  }
};
export const unstarGist = async (gistId: string): Promise<void> => {
  const token = getToken();
  const endpoint = `https://api.github.com/gists/${gistId}/star`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers,
    });

    if (response.ok) {
      console.log(`Gist ${gistId} unstarred successfully`);
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error unstarred gist ${gistId}:`, error);
  }
};