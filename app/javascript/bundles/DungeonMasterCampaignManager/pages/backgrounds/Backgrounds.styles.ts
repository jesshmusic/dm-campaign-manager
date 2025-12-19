import styled from 'styled-components';
import { respondTo } from '../../theme/mixins';

export const BackgroundsGrid = styled.div`
  display: grid;
  gap: calc(${({ theme }) => theme.spacing.spacer} * 1.5);
  grid-template-columns: 1fr;
  max-width: 100%;
  overflow: hidden;
  padding-top: calc(${({ theme }) => theme.spacing.spacer} * 2);

  ${respondTo.sm`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${respondTo.lg`
    grid-template-columns: repeat(4, 1fr);
  `}

  a {
    text-decoration: none;
  }
`;

export const BackgroundCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-image: url('/images/dndFrameOrange.png') 10;
  border-style: solid;
  border-width: 5px 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacer};
  padding: ${({ theme }) => theme.spacing.spacer};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

export const BackgroundCardHeader = styled.div`
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gold};
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacer};
  padding-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.75);
`;

export const BackgroundCardIcon = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.textRed};
  display: flex;
  flex-shrink: 0;
  font-size: 2.5rem;
  justify-content: center;
  width: 50px;
`;

export const BackgroundCardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin: 0;
`;

export const BackgroundDetail = styled.div`
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  strong {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

export const BackgroundDetailPage = styled.div`
  max-width: 800px;
`;

export const BackgroundSection = styled.div`
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 1.5);

  h3 {
    color: ${({ theme }) => theme.colors.textRed};
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const Tag = styled.span`
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: calc(${({ theme }) => theme.spacing.spacer} * 0.25)
    calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const EquipmentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.spacer};
`;

export const EquipmentOption = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border-left: 3px solid ${({ theme }) => theme.colors.gold};
  padding: ${({ theme }) => theme.spacing.spacer};

  strong {
    color: ${({ theme }) => theme.colors.textRed};
    display: block;
    margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.25);
  }
`;
