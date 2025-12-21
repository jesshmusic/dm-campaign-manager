/**
 * Shared modal styled components
 * Based on ConceptApprovalModal pattern
 */

import styled from 'styled-components';

export const ModalOverlay = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: ${({ theme }) => theme.zIndex?.modal || 1050};
`;

export const ModalContent = styled.div<{ $maxWidth?: string }>`
  background-color: ${({ theme }) => theme.colors?.cardBg || '#fdf1dc'};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) =>
    (theme.shadows as Record<string, string>)?.lg ||
    theme.shadows?.md ||
    '5px 7px 7px rgba(9, 9, 7, 0.5)'};
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-width: ${({ $maxWidth }) => $maxWidth ?? '900px'};
  overflow: hidden;
  width: 95%;
`;

export const ModalHeader = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
  color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  h2 {
    color: ${({ theme }) => theme.colors?.white || '#ffffff'};
    font-family: ${({ theme }) => theme.fonts?.mrEaves || "'Mr Eaves', serif"};
    font-size: ${({ theme }) => theme.fontSizes?.h3 || '1.25rem'};
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

export const ModalBody = styled.div`
  background-color: ${({ theme }) => theme.colors?.cardBg || '#fdf1dc'};
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

export const ModalFooter = styled.div`
  background-color: ${({ theme }) => theme.colors?.backgroundMed || '#f3e8d4'};
  border-top: 2px solid ${({ theme }) => theme.colors?.primary || '#972c1d'};
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
`;

export const ModalFooterSpaceBetween = styled(ModalFooter)`
  justify-content: space-between;
`;

// Delete confirmation specific styles
export const DeleteWarningIcon = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.danger || '#dc3545'};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  display: flex;
  font-size: 2rem;
  height: 4rem;
  justify-content: center;
  margin: 0 auto 1rem;
  width: 4rem;
`;

export const DeleteWarningText = styled.p`
  color: ${({ theme }) => theme.colors?.gray700 || '#272825'};
  font-family: ${({ theme }) => theme.fonts?.sansSerif || "'Scaly Sans', sans-serif"};
  font-size: ${({ theme }) => theme.fontSizes?.base || '1rem'};
  margin-bottom: 1rem;
  text-align: center;
`;

export const DeleteEntityName = styled.p`
  color: ${({ theme }) => theme.colors?.primary || '#972c1d'};
  font-family: ${({ theme }) => theme.fonts?.mrEaves || "'Mr Eaves', serif"};
  font-size: ${({ theme }) => theme.fontSizes?.h4 || '1.125rem'};
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;
