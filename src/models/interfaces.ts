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
    rawUrl?: string;
    description: string;
    
  }
  
  export interface GistResponse {
    data: Gist;
  }
  
  export interface RawCodeResponse {
    data: string;
  }

  export interface CardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any;
    searchQuery: string; 
    isAuthenticated: boolean;
    
    
  }
  export interface HeaderProps {
    onSearch: (query: string) => void; 
  }
  

  export  interface ListProps {
    searchQuery: string; 
    isAuthenticated: boolean;
  }
  export interface FormattedGist {
    key: string;
    owner: Owner;
    gistName: string;
    rawUrl: string;
    type: string;
    updatedAt: string;
    description: string;
    isStarred: boolean;
   
  }

  export interface User {
    photoURL: string | null; 
    displayName: string | null;
    }
    export interface DropdownProps {
      user: User;
      handleSignOut: () => void;
    }
    export interface GistFile {
      raw_url: string;
    }
    export interface RootState {
      gist: {
        isLoading: boolean;
        error: string | null;
      };
    }