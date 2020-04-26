import { gql } from 'apollo-boost';

export const LISTS = gql`
  {
    lists {
      id
      name
      order
      tasks {
        id
        description
        done
      }
    }
  }
`;
