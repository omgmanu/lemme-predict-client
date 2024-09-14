import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';

type UserContextType = {
  user: UserType | null;
  shouldLogin: boolean | undefined;
  logout: () => Promise<void>;
  login: () => Promise<void>;
};

type UserType = {
  name: string;
  id: string;
  username: string;
  publicKey: PublicKey;
  profile_image_url: string;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

export function UserProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [user, setUser] = useState<UserType | null>(null);
  const [shouldLogin, setShouldLogin] = useState<boolean | undefined>();

  const getUser = async (
    target: string,
  ): Promise<{ user: UserType | null }> => {
    if (shouldLogin) {
      return { user: null };
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/${target}`,
        {
          withCredentials: true,
        },
      );

      const { user } = response.data;

      // TODO: replace this with the actual public key
      user.publicKey = new PublicKey(
        'HZVDRbLnE1v85eD5vkKqEoqxWFDetpW3YSsmtBK5ytaZ',
      );

      return { user };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setShouldLogin(true);
      }
      return { user: null };
    }
  };

  const {
    data: loggedUser,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => getUser('me'),
    enabled: !user,
  });

  useEffect(() => {
    if (loggedUser) {
      setUser(loggedUser.user);
    }
  }, [loggedUser]);

  const login = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/x`;
  };

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/profile/logout`, {
        withCredentials: true,
      });
      setUser(null);
      setShouldLogin(true);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    shouldLogin,
    logout,
    login,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextType {
  return useContext(UserContext);
}
