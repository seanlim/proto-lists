import { gql } from 'apollo-boost';

export const DATA = gql`
  {
    data {
      lists {
        id
        next
        root
        name
      }
      tasks {
        id
        next
        listID
        description
        done
        date
      }
    }
  }
`;
