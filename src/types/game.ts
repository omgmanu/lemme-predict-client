export enum GameResultStatus {
  PENDING = 'pending',
  SETTLED = 'settled',
}

export const GameResultStatusLabel = {
  [GameResultStatus.PENDING]: 'Pending',
  [GameResultStatus.SETTLED]: 'Settled',
};

export type Game = {
  player: string;
  startTime: number;
  endTime: number;
  betAmount: number;
  prediction: boolean;
  id: string;
  transactionId: string;
};

export type GameResult = {
  gameId: string;
  player: string;
  startTime: number;
  endTime: number;
  betAmount: number;
  prediction: boolean;
  priceAtStart?: string;
  priceAtEnd?: string;
  result?: boolean;
  amountWon?: number;
  transactionId?: string;
  type: GameResultStatus;
};
