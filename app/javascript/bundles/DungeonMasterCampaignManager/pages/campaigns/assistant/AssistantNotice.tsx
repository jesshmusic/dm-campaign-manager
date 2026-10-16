import { Link } from 'react-router-dom';
import { AssistantError } from './useAssistantApi';
import { Notice } from '../Campaigns.styles';

/** Shows an AI error; points DMs without a key to where they can add one. */
const AssistantNotice = ({ error }: { error: AssistantError | null }) => {
  if (!error) return null;
  return error.needsKey ? (
    <Notice $tone="warning">
      AI planning needs your own OpenAI key or a premium Patreon membership.{' '}
      <Link to="/app/user-dashboard">Add a key in your dashboard</Link>.
    </Notice>
  ) : (
    <Notice>{error.message}</Notice>
  );
};

export default AssistantNotice;
