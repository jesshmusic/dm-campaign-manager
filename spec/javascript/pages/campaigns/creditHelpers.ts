/**
 * Helpers for the planner's "Learn more" credits: the credit lines inside part
 * of the page, and the sources each line links to.
 */
import { within } from '../../test-utils';

/** The "Learn more" lines inside an element */
export const creditLines = (container: HTMLElement) =>
  within(container).queryAllByText(/^Learn more:/);

/** The titles each "Learn more" line inside an element links to, line by line */
export const creditedTitles = (container: HTMLElement) =>
  creditLines(container).map((line) =>
    within(line)
      .getAllByRole('link')
      .map((link) => link.textContent),
  );
