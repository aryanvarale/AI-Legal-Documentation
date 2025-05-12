
export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any;
  profile: Profile | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (profileData: Partial<Profile>) => Promise<any>;
}
