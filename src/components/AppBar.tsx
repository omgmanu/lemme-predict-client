import { FC } from 'react';
import { Link } from 'wouter';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useUserContext } from '../providers/UserContextProvider';
import { ConnectWithXButton } from './ConnectWithXButton';

export const AppBar: FC = () => {
  const { user, logout } = useUserContext();

  return (
    <div className="navbar bg-base-300">
      <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-[1] bg-base-200 p-6 rounded-box shadow w-56 gap-2"
            >
              <li>
                <Link href="/game/new">New Game</Link>
              </li>
              <li>
                <Link href="/games">My Games</Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost bg-slate-900 text-xl">
            ₿🔮🤞🤷‍♂️
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/game/new">New Game</Link>
            </li>
            <li>
              <Link href="/games">My Games</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end flex">
          {user ? (
            <div className="dropdown dropdown-end">
              <div className="flex items-center">
                <div className="flex flex-col mr-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs">{user.username}</span>
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img alt="User avatar" src={user?.profile_image_url} />
                  </div>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-32 p-2 shadow"
              >
                <li>
                  <span>Wallet</span>
                </li>
                <li>
                  <span onClick={logout}>Logout</span>
                </li>
              </ul>
            </div>
          ) : (
            <ConnectWithXButton />
          )}
        </div>
      </div>
    </div>
  );
};
