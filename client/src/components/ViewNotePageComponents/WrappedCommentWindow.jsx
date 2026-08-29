import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import CommentsWindow from "./CommentsWindow";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_REACT_APP_GRAPHQL_ENDPOINT,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_REACT_APP_GRAPHQL_WS_ENDPOINT,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function WrappedCommentsWindow({ setTab }) {
  return (
    <ApolloProvider client={client}>
      <CommentsWindow setTab={setTab} />
    </ApolloProvider>
  );
}

export default WrappedCommentsWindow;
