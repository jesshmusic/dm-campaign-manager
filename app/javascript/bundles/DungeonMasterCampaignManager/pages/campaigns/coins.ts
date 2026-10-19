import { Coin, COINS, Currency } from './types';

/** Coins (pp, gp, ep, sp, cp) as a treasure or reward has them, and as a planner modal drafts them */

export const MAX_COINS = 1_000_000;

export const COIN_NAMES: Record<Coin, string> = {
  pp: 'Platinum',
  gp: 'Gold',
  ep: 'Electrum',
  sp: 'Silver',
  cp: 'Copper',
};

export const COIN_ERROR = 'Coins must be whole numbers from 0 to 1,000,000.';

// What's typed in each coin's input
export type CoinDrafts = Record<Coin, string>;

// Only the coins there are, most valuable first, e.g. { gp: 50, sp: 12 }
const counted = (currency: Currency): Currency =>
  Object.fromEntries(
    COINS.filter((coin) => (currency[coin] ?? 0) > 0).map((coin) => [coin, currency[coin]]),
  );

/** e.g. "1,200 gp, 12 sp"; empty when there are no coins. */
export const formatCoins = (currency: Currency) =>
  COINS.flatMap((coin) => {
    const count = currency[coin] ?? 0;
    return count > 0 ? [`${count.toLocaleString('en-US')} ${coin}`] : [];
  }).join(', ');

/** The inputs' text for some coins: blank for none */
export const coinDrafts = (currency: Currency) =>
  Object.fromEntries(
    COINS.map((coin) => [coin, currency[coin] ? String(currency[coin]) : '']),
  ) as CoinDrafts;

/**
 * The coins typed, keeping only those above zero, or null when one isn't a
 * whole number from 0 to 1,000,000.
 */
export const parseCoins = (drafts: CoinDrafts): Currency | null => {
  const counts = COINS.map((coin) => [coin, drafts[coin].trim()] as const)
    .filter(([, text]) => text !== '')
    .map(([coin, text]) => [coin, Number(text)] as const);
  if (counts.some(([, count]) => !Number.isInteger(count) || count < 0 || count > MAX_COINS)) {
    return null;
  }
  return counted(Object.fromEntries(counts));
};
