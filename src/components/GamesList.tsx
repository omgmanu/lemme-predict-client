import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { GameResult, GameResultStatus } from '../types/Game';
import { Link } from 'wouter';
import { formatDate, formatSolAmount } from '../utils';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const getGames = async (
  publicKey: string,
): Promise<{ message: GameResult[] }> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/games/${publicKey}`,
  );
  return response.data;
};

export const GamesList: FC = () => {
  const { publicKey } = useWallet();

  const {
    data: games,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['games', publicKey?.toBase58()],
    queryFn: () => getGames(publicKey?.toBase58() || ''),
    enabled: !!publicKey,
  });

  if (!publicKey) {
    return (
      <div className="container mx-auto max-w-60 my-52 ">
        <WalletMultiButton>Connect to get started</WalletMultiButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8 my-12">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
        My Games
      </h1>

      <p className="mt-6 text-md leading-6 text-gray-400">
        Welcome to your personal hall of fame (or shame)! Here you'll find a
        list of all the games you've bravely (or foolishly) participated in.
        Check out the your bold predictions, the bet amounts, and the
        thrilling results. Dive into your game history
        and remember, those who don't learn from history are doomed to repeat
        it... but hey, who needs history when you have luck, right?
      </p>

      <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="overflow-x-auto">
          {isLoading && <div>Loading games...</div>}
          {error && <div>Error fetching games: {(error as Error).message}</div>}
          {games && (
            <table className="table">
              {/* head */}
              <thead>
                <tr className="hover">
                  <th>ID</th>
                  <th>Prediction</th>
                  <th>Bet</th>
                  <th>Result</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {games.message.map((game) => (
                  <tr className="hover">
                    <td>
                      #{game.gameId}
                      <br />
                      <span className="badge badge-neutral badge-sm text-sm opacity-50">
                        {formatDate(game.startTime)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={
                                game.prediction
                                  ? '/up-arrow.png'
                                  : '/down-arrow.png'
                              }
                              alt="Direction"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {game.prediction ? 'Higher' : 'Lower'}
                          </div>
                          <div className="text-sm opacity-50">
                            {((game.endTime - game.startTime) / 60).toFixed(0)}{' '}
                            {game.endTime - game.startTime === 60
                              ? 'minute'
                              : 'minutes'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {formatSolAmount(game.betAmount)} SOL
                      <br />
                    </td>
                    <td>
                      {game.type === GameResultStatus.PENDING ? (
                        <div>
                          <p>In progress</p>
                          <progress className="progress w-16"></progress>
                        </div>
                      ) : (
                        <div
                          className={
                            game.result
                              ? 'badge badge-success'
                              : 'badge badge-error'
                          }
                        >
                          {game.result && game.amountWon
                            ? `WON ${formatSolAmount(game.amountWon)} SOL`
                            : `LOST`}
                        </div>
                      )}
                    </td>
                    <th>
                      <Link
                        className="btn btn-primary btn-sm"
                        href={`/game/${game.gameId}`}
                      >
                        details
                      </Link>
                    </th>
                  </tr>
                ))}
              </tbody>
              {/* foot */}
              {/* <tfoot>
                <tr>
                  <td colSpan={4} className="text-center">
                    <div className="flex justify-center mt-4">
                      <div className="join">
                        <button className="join-item btn">«</button>
                        <button className="join-item btn">Page 2</button>
                        <button className="join-item btn">»</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot> */}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
