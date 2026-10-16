import React from 'react';
import { render, screen, within } from '../../../test-utils';
import SceneThumbnail, {
  SceneGallery,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/SceneThumbnail';

const URL = 'https://bucket.s3.us-east-1.amazonaws.com/thumbnails/scenes/1/pass.webp';

describe('SceneThumbnail', () => {
  it('shows the thumbnail with the scene name', () => {
    render(<SceneThumbnail name="Mountain Pass" url={URL} />);

    const image = screen.getByRole('img', { name: 'Map: Mountain Pass' });
    expect(image).toHaveAttribute('src', URL);
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(screen.getByText('Foundry scene: Mountain Pass')).toBeInTheDocument();
  });

  it('shows just the name until Foundry sends a thumbnail', () => {
    render(<SceneThumbnail name="Mountain Pass" url={undefined} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Foundry scene: Mountain Pass')).toBeInTheDocument();
  });

  it('takes another label, or none', () => {
    const { rerender } = render(<SceneThumbnail name="Mountain Pass" url={URL} label="Map" />);
    expect(screen.getByText('Map: Mountain Pass')).toBeInTheDocument();

    rerender(<SceneThumbnail name="Mountain Pass" url={URL} label={null} />);
    expect(screen.getByText('Mountain Pass')).toBeInTheDocument();
  });

  it('lists several in a gallery', () => {
    render(
      <SceneGallery aria-label="Maps">
        <li>
          <SceneThumbnail name="Mountain Pass" url={URL} label={null} />
        </li>
        <li>
          <SceneThumbnail name="Cave" label={null} />
        </li>
      </SceneGallery>,
    );

    const gallery = screen.getByRole('list', { name: 'Maps' });
    expect(within(gallery).getAllByRole('listitem')).toHaveLength(2);
    expect(within(gallery).getAllByRole('img')).toHaveLength(1);
  });
});
