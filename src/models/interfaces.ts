export interface Owner {
    login: string;
    avatar_url: string;
  }
  
  export interface GistFile {
    raw_url: string;
  }
  
  export interface Gist {
    id: string;
    owner: Owner;
    files: Record<string, GistFile>;
    public: boolean;
    updated_at: string;
    description: string;
  }
  
  export interface GistResponse {
    data: Gist;
  }
  
  export interface RawCodeResponse {
    data: string;
  }