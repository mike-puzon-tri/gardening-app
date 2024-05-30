import { TRIApp } from '@toyota-research-institute/rse-react-library';
import '@toyota-research-institute/rse-react-library/style.css';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import config from './tri.app.config';
import PreLogin from './pages/pre-login';

// const queryClient = new QueryClient();

const App = () => {
  const client = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <TRIApp config={config} PreloginPage={<PreLogin />} />
    </ApolloProvider>
  );
};
export default App;
