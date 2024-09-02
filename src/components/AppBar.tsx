import { FC } from 'react';
import { Link } from 'wouter';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export const AppBar: FC = () => {
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
              // className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
          <WalletMultiButton />
        </div>
      </div>
    </div>
  );
};
