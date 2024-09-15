import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { BN } from 'bn.js';
import {
  Game,
  GameResult,
  GameResultStatus,
  GameResultStatusLabel,
} from '../types/game';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatPythPrice, formatSolAmount } from '../utils';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUserContext } from '../providers/UserContextProvider';

const getGame = async (
  gameId: string,
): Promise<{ message: { game: Game; gameResult: GameResult } }> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/game/${gameId}`,
  );
  return response.data;
};

export const GameDetails: FC = () => {
  const { gameId } = useParams();
  const { user } = useUserContext();
  const [initGame, setInitGame] = useState<Game | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(gameId || ''),
    enabled: !!gameId,
  });

  useEffect(() => {
    if (game) {
      setGameResult(game.message.gameResult);
      setInitGame(game.message.game);
    }
  }, [game]);

  const displayResult = useCallback(() => {
    if (gameResult?.result === undefined) {
      return 'N/A';
    }

    return gameResult?.result &&
      gameResult.amountWon &&
      new BN(gameResult.amountWon).gt(new BN(0))
      ? `WON ${formatSolAmount(new BN(gameResult?.amountWon).toNumber())} SOL`
      : `LOST`;
  }, [gameResult]);

  const buildTxUrl = (tx: string) => {
    const cluster =
      import.meta.env.VITE_NETWORK !== WalletAdapterNetwork.Mainnet
        ? `?cluster=${import.meta.env.VITE_NETWORK}`
        : '';

    return `${import.meta.env.VITE_EXPLORER_URL}/tx/${tx}${cluster}`;
  };

  if (!user?.publicKey) {
    return (
      <div className="container mx-auto max-w-60 my-52 ">
        <WalletMultiButton>Connect to get started</WalletMultiButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8 my-12">
      {game ? (
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Game #{game.message.game.id.toString()}
          </h1>
          {gameResult?.type === GameResultStatus.PENDING ? (
            <label className="form-control w-full mt-6">
              <div role="alert" className="alert alert-info">
                <span className="loading loading-ring loading-sm"></span>
                <span>
                  Game is currently running. Result will be available after{' '}
                  {new Date(
                    game.message.game.endTime * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    game.message.game.endTime * 1000,
                  ).toLocaleTimeString()}
                  .
                </span>
              </div>
            </label>
          ) : (
            <></>
          )}
          <div className="mt-10 flex flex-col game-details">
            <div className="flex items-center mb-4">
              <div className="icon mr-4">🏷️</div>
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="text-lg">
                  {gameResult ? GameResultStatusLabel[gameResult.type] : 'N/A'}{' '}
                  {gameResult?.type === GameResultStatus.PENDING ? '🤞' : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">🏆</div>
              <div>
                <div className="text-sm font-medium text-gray-500">Result</div>
                <div className="text-lg font-bold">
                  <div
                    className={
                      gameResult?.result !== undefined
                        ? gameResult.result
                          ? 'badge badge-success'
                          : 'badge badge-error'
                        : 'badge badge-neutral'
                    }
                  >
                    {displayResult()}
                  </div>{' '}
                  {gameResult?.amountWon &&
                  new BN(gameResult?.amountWon).eq(new BN(0))
                    ? '🤷‍♂️'
                    : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">👤</div>
              <div>
                <div className="text-sm font-medium text-gray-500">Player</div>
                <div className="text-lg">{game.message.game.player}</div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">💰</div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Bet Amount
                </div>
                <div className="text-lg">
                  {formatSolAmount(game.message.game.betAmount)} SOL
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">📈</div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Prediction
                </div>
                <div className="text-lg">
                  <div className="mask mask-squircle h-10 w-10">
                    <img
                      src={
                        game.message.game.prediction
                          ? '/up-arrow.png'
                          : '/down-arrow.png'
                      }
                      alt="Direction"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">⏰</div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Start Time & Price
                </div>
                <div className="text-lg">
                  {new Date(
                    game.message.game.startTime * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    game.message.game.startTime * 1000,
                  ).toLocaleTimeString()}
                  <span className="badge badge-neutral ml-2 text-lg">
                    {gameResult?.priceAtStart
                      ? formatPythPrice(gameResult?.priceAtStart)
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">🏁</div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  End Time & Price
                </div>
                <div className="text-lg">
                  {new Date(
                    game.message.game.endTime * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    game.message.game.endTime * 1000,
                  ).toLocaleTimeString()}
                  <span className="badge badge-neutral ml-2 text-lg">
                    {gameResult?.priceAtEnd
                      ? formatPythPrice(gameResult?.priceAtEnd)
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">📝</div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Transactions
                </div>
                <div className="text-lg">
                  {initGame?.transactionId ? (
                    <a
                      className="text-blue-500"
                      href={buildTxUrl(initGame.transactionId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Init game TX
                    </a>
                  ) : (
                    'N/A'
                  )}
                  {' - '}
                  {gameResult?.transactionId ? (
                    <a
                      className="text-blue-500"
                      href={buildTxUrl(gameResult.transactionId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Settle game TX
                    </a>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-4 my-52 ">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
    </div>
  );
};
