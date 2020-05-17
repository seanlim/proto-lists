import { gql } from 'apollo-boost';

export const LISTS = gql`
  {
    lists {
      id
      name
      tasks {
        id
        listID
        description
        done
        date
      }
    }
  }
`;
