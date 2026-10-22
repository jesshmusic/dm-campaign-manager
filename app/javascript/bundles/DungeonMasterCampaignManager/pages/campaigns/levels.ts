// Character levels, picked from a dropdown of 1 to 20 wherever a form asks for
// one: a campaign's starting and target level, a quest's levels, a session's
// party level
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 20;

export const LEVEL_OPTIONS = Array.from({ length: MAX_LEVEL - MIN_LEVEL + 1 }, (_, index) => {
  const level = String(MIN_LEVEL + index);
  return { value: level, label: level };
});
