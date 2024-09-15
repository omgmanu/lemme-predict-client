import type { FC } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppBar } from './components/AppBar';
import { Game } from './components/Game';
import { GamesList } from './components/GamesList';
import { Footer } from './components/Footer';
import { GameDetails } from './components/GameDetails';
import { Home } from './components/Home';
import { UserProvider } from './providers/UserContextProvider';
import { Wallet } from './components/Wallet';

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppBar />

        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game/new" component={Game} />
          <Route path="/game/:gameId" component={GameDetails} />
          <Route path="/games" component={GamesList} />
          <Route path="/wallet" component={Wallet} />
        </Switch>

        <Footer />
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
