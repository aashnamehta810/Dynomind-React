import styled from 'styled-components';
import { SearchInput } from 'components/common/inputs/SearchInput/SearchInput';
import { media } from '@app/styles/themes/constants';

export const InputSearch = styled(SearchInput)`
  .ant-input-group-addon {
    display: none;
  }

  @media only screen and ${media.md} {
    .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
      border-radius: 3.125rem;
      border: 0;
      padding: 0.5625rem 1.25rem;
    }
  }
`;

export const TableActionWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;

  .addRole {
    width: 9rem;
  }

  .ant-input-group-wrapper {
    width: 8rem;
  }

  @media only screen and ${media.sm} {
    .ant-input-group-wrapper {
      width: 10rem;
    }
  }

  @media only screen and ${media.md} {
    .ant-input-group-wrapper {
      width: 12rem;
    }
  }

  @media only screen and ${media.lg} {
    .ant-input-group-wrapper {
      width: 15rem;
    }
  }
`;
