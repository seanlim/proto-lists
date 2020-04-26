import { gql } from 'apollo-boost';

export const LIST_CREATE = gql`
  mutation ($input: ListCreateInput!) {
    listCreate(input: $input){
      id,
      name,
      tasks {
        id
        listID
        order
        description
        done
        date
      },
    }
  }
`;

export const LIST_UPDATE = gql`
  mutation ($input: ListUpdateInput!) {
    listUpdate (input: $input){
      id,
      name,
      tasks {
        id
        listID
        order
        description
        done
        date
      },
    }
  }
`;

export const LIST_DESTORY = gql`
  mutation ($input: ID!) {
    listDestroy(id: $input)
  }
`;

export const TASK_CREATE = gql`
  mutation ($input: TaskCreateInput!){
    taskCreate(input: $input) {
      id
      listID
      order
      description
      done
      date
    }
  }
`;

export const TASK_UPDATE = gql`
  mutation ($input: TaskUpdateInput!){
    taskUpdate(input: $input) {
      id
      listID
      order
      description
      done
      date
    }
  }
`;

export const TASK_DESTROY = gql`
  mutation ($input: ID!){
    taskDestroy(id: $input)
  }
`;
