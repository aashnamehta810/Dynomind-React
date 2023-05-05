import styled from 'styled-components';
import { SearchInput } from 'components/common/inputs/SearchInput/SearchInput';
import { media } from '@app/styles/themes/constants';

export const TablesWrapper = styled.div`
  margin-top: 1.875rem;
`;

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

  .addUser {
    width: 9rem;
  }

  .search-input {
    width: 8rem;
  }

  @media only screen and ${media.sm} {
    .search-input {
      width: 10rem;
    }
  }

  @media only screen and ${media.md} {
    .search-input {
      width: 12rem;
    }
  }

  @media only screen and ${media.lg} {
    .search-input {
      width: 15rem;
    }
  }
`;
