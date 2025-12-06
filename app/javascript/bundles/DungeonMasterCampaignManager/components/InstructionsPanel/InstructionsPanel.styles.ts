import styled from 'styled-components';
import { adjustLightness } from '../../theme/mixins';

// Modal Overlay
export const ModalOverlay = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 0.125rem solid ${({ theme }) => theme.colors.orange};
  border-radius: ${({ theme }) => theme.borders.radiusLg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-height: 80vh;
  max-width: 600px;
  overflow-y: auto;
  width: 90%;
`;

export const ModalHeader = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 0.125rem solid ${({ theme }) => theme.colors.orange};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  gap: 0.5rem;
  justify-content: space-between;
  padding: 0.75rem 1rem;
`;

export const ModalTitle = styled.span`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const CloseButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  padding: 0.25rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

export const ModalContent = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.6;
  padding: 1.5rem;

  h4 {
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0 0 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    margin: 0 0 1rem;
    padding-left: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const AIBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.iris};
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 0.125rem 0.5rem;
  vertical-align: middle;
`;

// Info button to trigger modal
export const InfoButton = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.darkRed};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => adjustLightness(theme.colors.darkRed, -10)};
    transform: scale(1.05);
  }
`;
