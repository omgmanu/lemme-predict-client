import { FC } from 'react';
import { useUserContext } from '../providers/UserContextProvider';

export const ConnectWithXButton: FC = () => {
  const { login } = useUserContext();

  return (
    <button
      className="btn"
      onClick={login}
    >
      Sign in
    </button>
  );
};
