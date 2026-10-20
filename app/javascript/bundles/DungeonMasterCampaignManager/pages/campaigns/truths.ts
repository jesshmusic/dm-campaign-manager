import { Truth } from './types';

// About six is plenty; the server takes up to this many
export const MAX_TRUTHS = 20;
export const MAX_TRUTH_NAME_LENGTH = 120;
export const MAX_TRUTH_DESCRIPTION_LENGTH = 1000;

// Where a truth written as one line ends its first sentence: ".", "!" or "?" then whitespace
const SENTENCE_END = /[.!?]\s/;

export const emptyTruth = (): Truth => ({ name: '', description: '' });

/**
 * A truth written as one line, as truths were before they had names: split
 * after its first sentence, the punctuation staying on the name. With no
 * sentence end, it's all name. The server (Campaign.normalize_truths) and the
 * Foundry module split the same way.
 *
 * "Greyhawk runs on gold. The Directing Oligarchy governs." is the name
 * "Greyhawk runs on gold." and the description "The Directing Oligarchy governs."
 */
export const truthFromText = (text: string): Truth => {
  const trimmed = text.trim();
  const end = trimmed.search(SENTENCE_END);
  if (end < 0) return { name: trimmed, description: '' };
  return { name: trimmed.slice(0, end + 1), description: trimmed.slice(end + 1).trim() };
};

const text = (value: unknown) => (typeof value === 'string' ? value : '');

/**
 * Truths from anything that may hold them: a list of truths, a list mixing
 * in older one-line strings, or text with one truth per line (what a
 * new-campaign draft saved before truths had names holds). Rows are kept as
 * they are, even empty ones the DM is still filling in.
 */
export const truthsFrom = (value: unknown): Truth[] => {
  if (typeof value === 'string') {
    return value
      .split('\n')
      .filter((line) => line.trim())
      .map(truthFromText);
  }
  if (!Array.isArray(value)) return [];
  return value.flatMap((item: unknown) => {
    if (typeof item === 'string') return item.trim() ? [truthFromText(item)] : [];
    if (item && typeof item === 'object') {
      const { name, description } = item as Record<string, unknown>;
      return [{ name: text(name), description: text(description) }];
    }
    return [];
  });
};

/** The truths to save: trimmed, leaving out rows with neither a name nor a description */
export const truthsToSave = (truths: Truth[]): Truth[] =>
  truths
    .map((truth) => ({ name: truth.name.trim(), description: truth.description.trim() }))
    .filter((truth) => truth.name || truth.description);

/** True when a truth has a description but no name, which the server rejects */
export const truthsMissingName = (truths: Truth[]) =>
  truthsToSave(truths).some((truth) => !truth.name);
