import { InfoBlockWrapper } from './InfoBlock.styles';

const InfoBlock = (props: { title: string; desc: string }) => (
  <InfoBlockWrapper>
    <span>{props.title}: </span>
    {props.desc}
  </InfoBlockWrapper>
);

export default InfoBlock;
