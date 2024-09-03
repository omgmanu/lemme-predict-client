import { FC, useCallback, useState } from 'react';
import { SystemProgram, TransactionSignature } from '@solana/web3.js';
import {
  program,
  buildGamePDA,
  generateGameId,
  betAmountDivider,
} from '../anchor/setup';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Game: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [newGameId, setNewGameId] = useState<BN>();
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState(60);
  const [betAmount, setBetAmount] = useState(2);
  const [prediction, setPrediction] = useState(true);
  const [newGameTransaction, setNewGameTransaction] =
    useState<TransactionSignature>();

  const formatBetAmountToLamports = useCallback(() => {
    return (betAmount * 1000000000) / betAmountDivider;
  }, [betAmount]);

  const formatBetAmountToSol = useCallback(() => {
    return betAmount / betAmountDivider;
  }, [betAmount]);

  const startGame = useCallback(async () => {
    if (!connection || !publicKey) {
      return;
    }

    setIsLoading(true);

    try {
      const gameId = generateGameId();
      console.log('gameId', gameId.toString());
      const gamePDA = buildGamePDA(publicKey, gameId);

      console.log('program', program);

      const transaction = await program.methods
        .newGame(
          gameId,
          new BN(timeframe),
          new BN(formatBetAmountToLamports()),
          prediction,
        )
        .accounts({
          player: publicKey,
          // @ts-expect-error - TODO: fix this
          game: gamePDA,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const latestBlockhash = await connection.getLatestBlockhash();

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = latestBlockhash.blockhash;

      const transactionSignature = await sendTransaction(
        transaction,
        connection,
      );

      console.log('transactionSignature', transactionSignature);
      console.log('gameId', gameId.toString());
      setNewGameTransaction(transactionSignature);
      setNewGameId(gameId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    connection,
    publicKey,
    timeframe,
    formatBetAmountToLamports,
    prediction,
    sendTransaction,
  ]);

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
        New Game
      </h1>

      <p className="mt-6 text-md leading-6 text-gray-400">
        Think you can predict Bitcoin's next move? Choose your timeframe, set
        the bet amount and make the prediction, then let the games begin! Track
        your progress and see if you have what it takes to outsmart the market.
        Good luck, and may the odds be in your favor!
      </p>

      <div className="mt-10 flex flex-col items-center">
        {/* <div className="my-4 sm:w-96 w-72">
          <label className="form-control w-full max-w-xs">
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">Price</div>
                <div className="stat-value text-primary">61,051</div>
                <div className="stat-desc">USD</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Trend is</div>
                <div className="stat-value text-red-500">Down</div>
                <div className="stat-desc">Last 5 minutes</div>
              </div>
            </div>
          </label>
        </div> */}
        <div className="my-4 sm:w-96 w-72">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Timeframe</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              value={timeframe}
              onChange={(e) => setTimeframe(parseInt(e.target.value))}
            >
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
            </select>
          </label>
        </div>
        <div className="my-4 sm:w-96 w-72">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">
                Bet Amount: {formatBetAmountToSol()} SOL
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              className="range"
              step={1}
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
            />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </label>
        </div>
        <div className="my-4 sm:w-96 w-72">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">
                Prediction: {prediction ? 'Higher' : 'Lower'}
              </span>
            </div>
            <label className="swap swap-flip text-9xl">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                defaultChecked
                onChange={(e) => setPrediction(e.target.checked)}
              />
              <div className="swap-on">
                <img src="/up-arrow.png" alt="Up arrow" />
              </div>
              <div className="swap-off">
                <img
                  src="/down-arrow.png"
                  alt="Up Arrow"
                />
              </div>
            </label>
          </label>
        </div>
        <div className="my-4 sm:w-96 w-72">
          <label className="form-control w-full max-w-xs">
            <div className="divider">Summary</div>
            <blockquote>
              <h3>{`I bet ${formatBetAmountToSol()} SOL that in ${timeframe} seconds the price will be ${
                prediction ? 'Higher' : 'Lower'
              }.`}</h3>
            </blockquote>
          </label>
        </div>
        {newGameTransaction ? (
          <div className="my-4 sm:w-96 w-72">
            <label className="form-control w-full max-w-xs">
              <div role="alert" className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Game started!</span>
                <div>
                  <a
                    href={`/game/${newGameId?.toString()}`}
                    className="btn btn-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <></>
        )}
        <div className="my-4 sm:w-96 w-72">
          <label className="form-control w-full max-w-xs">
            <button
              className="btn btn-primary btn-lg"
              onClick={startGame}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Start Game'}
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};
