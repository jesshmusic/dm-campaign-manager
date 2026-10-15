import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import { CampaignState } from '../useCampaign';
import { Campaign, Location } from '../types';
import { List, Meta } from '../Campaigns.styles';

type PlacesTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const PlacesTab = ({ campaign, state }: PlacesTabProps) => {
  const { api, saveChild, removeChild } = state;

  const fieldsFor = (current?: Location): FieldConfig[] => [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      helper: { label: 'Tavern name', generate: () => api.randomTavernName(campaign.settingName) },
    },
    {
      name: 'parent_id',
      label: 'Inside',
      type: 'select',
      blankLabel: 'Nowhere (top level)',
      options: campaign.locations
        .filter((location) => location.id !== current?.id)
        .map((location) => ({ value: location.id, label: location.name })),
    },
    { name: 'description', label: 'Description', type: 'textarea', wide: true },
    {
      name: 'features',
      label: 'Fantastic features',
      hint: 'Three evocative details the players can interact with, one per line',
      type: 'lines',
      wide: true,
    },
    { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  ];

  const nameOf = (id: string | null) =>
    campaign.locations.find((location) => location.id === id)?.name;

  return (
    <EntitySection<Location>
      title="Places"
      noun="location"
      items={campaign.locations}
      fields={fieldsFor()}
      editFields={(location) => fieldsFor(location)}
      valuesFor={(location) => ({ ...location, parent_id: location.parentId })}
      emptyText="No locations yet. Fantastic locations make great backdrops for scenes."
      onSave={(attributes, id) => saveChild('locations', attributes, id)}
      onDelete={(id) => removeChild('locations', id)}
      renderItem={(location) => (
        <>
          <h3>{location.name}</h3>
          {location.parentId && <Meta>In {nameOf(location.parentId)}</Meta>}
          {location.description && <p>{location.description}</p>}
          {location.features.length > 0 && (
            <List>
              {location.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </List>
          )}
        </>
      )}
    />
  );
};

export default PlacesTab;
