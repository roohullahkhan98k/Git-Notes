// gistHelper.ts
import { Gist ,FormattedGist} from '../models/interfaces';
import ApiEndpoints from '../models/api.enum';

const token = import.meta.env.VITE_GITHUB_TOKEN;

export const fetchGists = async (page: number, pageSize: number): Promise<Gist[]> => {
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

// gistHelper.ts
export const filterGists = (data: Gist[], searchQuery: string): Gist[] => {
    return data.filter((gist) =>
      gist.owner.login.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
export const formatGistsForList = (data: Gist[]): unknown[] => {
  return data.map((gist) => ({
    key: gist.id,
    owner: gist.owner,
    gistName: Object.keys(gist.files)[0],
    type: gist.public ? 'Public' : 'Private',
    updatedAt: gist.updated_at,
  }));
};

export const formatGistsForCard = (data: Gist[]): FormattedGist[] => {
    return data.map((gist) => ({
      key: gist.id,
      owner: gist.owner,
      gistName: Object.keys(gist.files)[0],
      rawUrl: Object.values(gist.files)[0].raw_url,
      type: gist.public ? 'Public' : 'Private',
      updatedAt: gist.updated_at,
      description: gist.description,
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