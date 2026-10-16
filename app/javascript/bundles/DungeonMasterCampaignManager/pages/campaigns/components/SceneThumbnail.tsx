import styled from 'styled-components';
import { Meta } from '../Campaigns.styles';

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  max-width: 24rem;

  img {
    aspect-ratio: 16 / 9;
    background: ${({ theme }) => theme.colors.borderColor};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 4px;
    object-fit: cover;
    width: 100%;
  }

  figcaption {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

/** Several maps side by side, e.g. a session's maps: a list of SceneThumbnails, each in an li */
export const SceneGallery = styled.ul`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
`;

type SceneThumbnailProps = {
  name: string;
  // From the campaign's sceneThumbnails; missing until Foundry sends one
  url?: string | null;
  // Before the name, e.g. "Foundry scene: Mountain Pass"; null for just the name
  label?: string | null;
};

/**
 * A Foundry scene used as a map. Dorman Lakely's Campaign Planner sends a
 * thumbnail of each one, so it shows here while Foundry is closed; until it
 * has, just the scene's name.
 */
const SceneThumbnail = ({ name, url, label = 'Foundry scene' }: SceneThumbnailProps) => {
  const caption = label ? `${label}: ${name}` : name;
  return url ? (
    <Figure>
      <img src={url} alt={`Map: ${name}`} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </Figure>
  ) : (
    <Meta>{caption}</Meta>
  );
};

export default SceneThumbnail;
