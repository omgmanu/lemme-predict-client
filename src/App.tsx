import type { FC } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WalletContextProvider from './providers/WalletContextProvider';
import { AppBar } from './components/AppBar';
import { Game } from './components/Game';
import { GamesList } from './components/GamesList';
import { Footer } from './components/Footer';
import { GameDetails } from './components/GameDetails';
import { Home } from './components/Home';

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <WalletContextProvider>
      <AppBar />
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game/new" component={Game} />
          <Route path="/game/:gameId" component={GameDetails} />
          <Route path="/games" component={GamesList} />
        </Switch>
      </QueryClientProvider>
      <Footer />
    </WalletContextProvider>
  );
};

export default App;
