import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  program,
  buildGamePDA,
  buildGameResultPDA,
  GameData,
  GameResultData,
} from '../anchor/setup';
import { BN } from 'bn.js';
import {
  Game,
  GameResult,
  GameResultStatus,
  GameResultStatusLabel,
} from '../types/Game';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatPythPrice, formatSolAmount } from '../utils';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

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
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [initGame, setInitGame] = useState<Game | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameResultData, setGameResultData] = useState<GameResultData | null>(
    null,
  );

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(gameId || ''),
    enabled: !!gameId,
  });

  useEffect(() => {
    if (program && publicKey && gameId) {
      const gamePDA = buildGamePDA(publicKey, new BN(gameId));
      let gameResultSubscriptionId: number | null = null;

      program.account.game.fetch(gamePDA).then((data: GameData) => {
        setGameData(data);
      });

      try {
        const gameResultPDA = buildGameResultPDA(new BN(gameId));
        program.account.gameResult
          .fetch(gameResultPDA)
          .then((data: GameResultData) => {
            setGameResultData(data);
            console.log(data);
          });

        gameResultSubscriptionId = connection.onAccountChange(
          gameResultPDA,
          (accountInfo) => {
            setGameResultData(
              program.coder.accounts.decode('game_result', accountInfo.data),
            );
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // game result not available yet
      }

      // Subscribe to account changes
      const gameSubscriptionId = connection.onAccountChange(
        gamePDA,
        (accountInfo) => {
          setGameData(program.coder.accounts.decode('game', accountInfo.data));
        },
      );

      return () => {
        // Unsubscribe from account changes
        connection.removeAccountChangeListener(gameSubscriptionId);
        if (gameResultSubscriptionId) {
          connection.removeAccountChangeListener(gameResultSubscriptionId);
        }
      };
    }
  }, [connection, gameId, publicKey]);

  useEffect(() => {
    if (game) {
      setGameResult(game.message.gameResult);
      setInitGame(game.message.game);
    }
  }, [game]);

  const displayResult = useCallback(() => {
    if (!gameResultData) {
      return 'N/A';
    }

    return gameResultData?.result &&
      new BN(gameResultData?.amountWon).gt(new BN(0))
      ? `WON ${formatSolAmount(
          new BN(gameResultData?.amountWon).toNumber(),
        )} SOL`
      : `LOST`;
  }, [gameResultData]);

  const buildTxUrl = (tx: string) => {
    const cluster =
      import.meta.env.VITE_NETWORK !== WalletAdapterNetwork.Mainnet
        ? `?cluster=${import.meta.env.VITE_NETWORK}`
        : '';

    return `${import.meta.env.VITE_EXPLORER_URL}/tx/${tx}${cluster}`;
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto max-w-60 my-52 ">
        <WalletMultiButton>Connect to get started</WalletMultiButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8 my-12">
      {gameData ? (
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Game #{gameData.id.toString()}
          </h1>
          {gameResult?.type === GameResultStatus.PENDING ? (
            <label className="form-control w-full mt-6">
              <div role="alert" className="alert alert-info">
                <span className="loading loading-ring loading-sm"></span>
                <span>
                  Game is currently running. Result will be available after{' '}
                  {new Date(
                    gameData.endTime.toNumber() * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    gameData.endTime.toNumber() * 1000,
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
                      gameResultData
                        ? gameResultData.result
                          ? 'badge badge-success'
                          : 'badge badge-error'
                        : 'badge badge-neutral'
                    }
                  >
                    {displayResult()}
                  </div>{' '}
                  {gameResultData?.amountWon &&
                  new BN(gameResultData?.amountWon).eq(new BN(0))
                    ? '🤷‍♂️'
                    : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">👤</div>
              <div>
                <div className="text-sm font-medium text-gray-500">Player</div>
                <div className="text-lg">{gameData?.player.toBase58()}</div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="icon mr-4">💰</div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Bet Amount
                </div>
                <div className="text-lg">
                  {formatSolAmount(gameData.betAmount.toNumber())} SOL
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
                        gameData.prediction
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
                    gameData.startTime.toNumber() * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    gameData.startTime.toNumber() * 1000,
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
                    gameData.endTime.toNumber() * 1000,
                  ).toLocaleDateString()}{' '}
                  -{' '}
                  {new Date(
                    gameData.endTime.toNumber() * 1000,
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
