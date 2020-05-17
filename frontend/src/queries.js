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

export const LIST = gql`
  query ($input: ID!){
    list(id: $input) {
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

export const Task = gql`
  query ($input: ID!){
    task(id: $input) {
        id
        listID
        description
        done
        date
    }
  }
`;
