import styled from 'styled-components';
import { respondTo } from '../../theme/mixins';

export const FeatsContainer = styled.div`
  padding-top: calc(${({ theme }) => theme.spacing.spacer} * 2);
`;

export const CategorySection = styled.div`
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 3);
`;

export const CategoryTitle = styled.h2`
  border-bottom: 3px solid ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.textRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 1.5);
  padding-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const FeatsGrid = styled.div`
  display: grid;
  gap: calc(${({ theme }) => theme.spacing.spacer} * 1.5);
  grid-template-columns: 1fr;

  ${respondTo.sm`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${respondTo.lg`
    grid-template-columns: repeat(3, 1fr);
  `}

  a {
    text-decoration: none;
  }
`;

export const FeatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-image: url('/images/dndFrameOrange.png') 10;
  border-style: solid;
  border-width: 5px 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
  padding: ${({ theme }) => theme.spacing.spacer};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

export const FeatCardHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacer};
`;

export const FeatCardIcon = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.textRed};
  display: flex;
  flex-shrink: 0;
  font-size: 2rem;
  justify-content: center;
`;

export const FeatCardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin: 0;
`;

export const FeatCardMeta = styled.div`
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-style: italic;
`;

export const FeatCardPrerequisite = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  strong {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

export const RepeatableBadge = styled.span`
  background: ${({ theme }) => theme.colors.gold};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: bold;
  margin-left: auto;
  padding: 2px 8px;
`;

export const FeatDetailPage = styled.div`
  max-width: 800px;
`;

export const FeatHeader = styled.div`
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 2);
`;

export const FeatCategory = styled.div`
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-style: italic;
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const FeatPrerequisite = styled.div`
  background: ${({ theme }) => theme.colors.gray100};
  border-left: 3px solid ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.gray700};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  margin-top: ${({ theme }) => theme.spacing.spacer};
  padding: calc(${({ theme }) => theme.spacing.spacer} * 0.75);

  strong {
    color: ${({ theme }) => theme.colors.textRed};
  }
`;

export const FeatDescription = styled.div`
  font-family: ${({ theme }) => theme.fonts.bookInsanity};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;

  p {
    margin-bottom: ${({ theme }) => theme.spacing.spacer};
  }

  strong {
    color: ${({ theme }) => theme.colors.textRed};
  }
`;
