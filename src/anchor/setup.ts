import { AnchorProvider, IdlAccounts, Program, BN } from '@coral-xyz/anchor';
import idl from './game.json';
import type { Game } from './game';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const programId = new PublicKey(idl.address);

export const generateGameId = (size = 8): BN => {
  const result = crypto.getRandomValues(new Uint8Array(size));
  return new BN(result);
};

const getProvider = () => {
  // const connection = new Connection('http://localhost:8899');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const provider = new AnchorProvider(
    connection,
    window.solana,
    AnchorProvider.defaultOptions(),
  );
  return provider;
};

export const program = new Program<Game>(idl as Game, getProvider());

export const buildGamePDA = (
  playerPublicKey: PublicKey,
  gameId: BN,
): PublicKey => {

  const gamePDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from('game'),
      playerPublicKey.toBuffer(),
      gameId.toArrayLike(Buffer, 'le', 8),
    ],
    programId,
  )[0];

  return gamePDA;
};

export const buildGameResultPDA = (
  gameId: BN,
): PublicKey => {

  const gameResultPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from('game_result'),
      gameId.toArrayLike(Buffer, 'le', 8),
    ],
    programId,
  )[0];

  return gameResultPDA;
};

export const betAmountDivider = 100;

export type GameData = IdlAccounts<Game>['game'];
export type GameResultData = IdlAccounts<Game>['gameResult'];
