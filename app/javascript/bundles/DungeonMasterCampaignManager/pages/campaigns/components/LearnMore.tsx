import React from 'react';
import styled, { css } from 'styled-components';
import { CreditKey, creditsFor, Source, sourcesByAuthor } from '../techniques';
import { Meta, SectionTitle } from '../Campaigns.styles';

const quietLinks = css`
  a {
    color: inherit;
    text-decoration: underline dotted;
  }

  a:hover,
  a:focus-visible {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Small and quiet, so it doesn't compete with the planner
const Credit = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin: 0.125rem 0 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  ${quietLinks}
`;

const SourceLink = ({ source }: { source: Source }) => (
  <a href={source.url} target="_blank" rel="noopener noreferrer">
    {source.title}
  </a>
);

type LearnMoreProps = {
  // The places to credit (see techniques.ts)
  credits: CreditKey[];
  // A span, for inside a line of text
  inline?: boolean;
};

/**
 * "Learn more" links to where a technique comes from, each opening in a new
 * tab: "Learn more: Fronts (Dungeon World) · …". Nothing when there's
 * nothing to credit.
 */
const LearnMore = ({ credits, inline = false }: LearnMoreProps) => {
  const sources = creditsFor(credits);
  if (sources.length === 0) return null;
  return (
    <Credit as={inline ? 'span' : 'div'}>
      Learn more:{' '}
      {sources.map((source, index) => (
        <React.Fragment key={source.id}>
          {index > 0 && ' · '}
          <SourceLink source={source} /> ({source.by})
        </React.Fragment>
      ))}
    </Credit>
  );
};

const AuthorList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;

  li {
    margin: 0.15rem 0;
  }

  ul {
    margin: 0 0 0.25rem;
    padding-left: 1.25rem;
  }
`;

const Sources = styled.section`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 2rem;
  ${quietLinks}

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

/** Every technique the planner borrows, grouped by who came up with it */
export const IdeaSources = () => (
  <Sources aria-labelledby="idea-sources-title">
    <SectionTitle id="idea-sources-title">Where these ideas come from</SectionTitle>
    <Meta>
      The planner borrows techniques from these game masters and games. Their articles explain each
      one in depth.
    </Meta>
    <AuthorList>
      {sourcesByAuthor().map(({ author, sources }) => (
        <li key={author}>
          <strong>{author}</strong>
          <ul aria-label={author}>
            {sources.map((source) => (
              <li key={source.id}>
                <SourceLink source={source} />: {source.about}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </AuthorList>
  </Sources>
);

export default LearnMore;
