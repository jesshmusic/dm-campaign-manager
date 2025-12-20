import styled from 'styled-components';
import { respondToContainer, hexToRgba, adjustLightness } from '../../theme/mixins';

export const Wrapper = styled.div`
  ${respondToContainer.md``}
`;

export const Section = styled.div`
  padding: ${({ theme }) => theme.spacing.spacer} 0;
  position: relative;
  width: 100%;
`;

export const UserInfo = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

export const UserPic = styled.div`
  margin-right: 1rem;
`;

export const UserData = styled.div`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.lg};

  strong {
    color: ${({ theme }) => theme.colors.bloodRed};
    margin-right: 1rem;
  }

  p {
    margin: 0.25rem 0;
  }
`;

export const DashboardHeader = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.yellow};
  border-top: 2px solid ${({ theme }) => theme.colors.yellow};
  margin-bottom: 1rem;
  padding: 0;

  h2 {
    border-bottom: 0;
    margin: 0;
    padding: 0.5rem 0 0;

    small {
      font-family: ${({ theme }) => theme.fonts.serif};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      font-style: italic;
    }
  }
`;

export const Buttons = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const AddListContent = styled.div``;

export const AddListHeading = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;

  h3 {
    margin: 0;
  }
`;

export const AddListContentInner = styled.div`
  padding: 1rem;
`;

export const DashboardModal = styled.div`
  background: ${({ theme }) => adjustLightness(theme.colors.yellow, 25)};
  border-radius: 4px;
  outline: none;
  overflow: auto;
  padding: 0;
  position: absolute;
`;

export const DashboardModalOverlay = styled.div<{ $isCollapsed?: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => hexToRgba(theme.colors.primary, 0.75)};
  display: flex;
  inset: 0 0 0 4.75rem;
  justify-content: center;
  position: fixed;
  z-index: 100;
`;
