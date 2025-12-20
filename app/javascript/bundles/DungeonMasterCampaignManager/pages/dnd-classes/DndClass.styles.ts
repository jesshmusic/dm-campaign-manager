import styled from 'styled-components';

export const Page = styled.div`
  width: 100%;
`;

export const SectionHeading = styled.h2`
  color: ${({ theme }) => theme.colors.darkRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
`;

export const SectionGroup = styled.div`
  display: inline-block;
  width: 100%;
`;

export const SubsectionHeading = styled.h3`
  color: ${({ theme }) => theme.colors.darkRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const FeatureHeading = styled.h4`
  border-bottom: solid 0.125rem ${({ theme }) => theme.colors.yellow};
  color: ${({ theme }) => theme.colors.darkRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
`;

export const InfoSection = styled.div`
  column-gap: 3rem;
  columns: 400px 2;
`;

export const TableContainer = styled.div`
  margin: 0 auto;
  max-width: 1140px;
`;
