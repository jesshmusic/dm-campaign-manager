import styled, { useTheme } from 'styled-components';

const ClockWrapper = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
  }

  path[role='button'] {
    cursor: pointer;
  }
`;

const StepButton = styled.button`
  background: ${({ theme }) => theme.colors.lightBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  height: 1.75rem;
  line-height: 1;
  width: 1.75rem;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`;

const wedgePath = (index: number, segments: number, radius: number) => {
  const start = ((index / segments) * 360 - 90) * (Math.PI / 180);
  const end = (((index + 1) / segments) * 360 - 90) * (Math.PI / 180);
  const x1 = radius + radius * Math.cos(start);
  const y1 = radius + radius * Math.sin(start);
  const x2 = radius + radius * Math.cos(end);
  const y2 = radius + radius * Math.sin(end);
  return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
};

type ProgressClockProps = {
  name: string;
  segments: number;
  filled: number;
  size?: number;
  // Omit for a read-only clock
  onChange?: (filled: number) => void;
};

/**
 * A Blades in the Dark style progress clock. Click a segment to fill up to
 * it (click the last filled segment to empty it), or use the -/+ buttons.
 */
const ProgressClock = ({ name, segments, filled, size = 72, onChange }: ProgressClockProps) => {
  const theme = useTheme();
  const radius = size / 2;
  const label = `${name}: ${filled} of ${segments} segments filled`;

  const setFilled = (value: number) => onChange?.(Math.max(0, Math.min(segments, value)));

  return (
    <ClockWrapper>
      {onChange && (
        <StepButton
          type="button"
          aria-label={`Wind back ${name}`}
          disabled={filled <= 0}
          onClick={() => setFilled(filled - 1)}
        >
          −
        </StepButton>
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <title>{label}</title>
        {Array.from({ length: segments }, (_, index) => (
          <path
            key={index}
            d={wedgePath(index, segments, radius - 1)}
            transform="translate(1 1)"
            fill={index < filled ? theme.colors.primary : theme.colors.white}
            stroke={theme.colors.primaryDark}
            strokeWidth={1.5}
            role={onChange ? 'button' : undefined}
            onClick={
              onChange ? () => setFilled(index + 1 === filled ? index : index + 1) : undefined
            }
          />
        ))}
      </svg>
      {onChange && (
        <StepButton
          type="button"
          aria-label={`Advance ${name}`}
          disabled={filled >= segments}
          onClick={() => setFilled(filled + 1)}
        >
          +
        </StepButton>
      )}
    </ClockWrapper>
  );
};

export default ProgressClock;
