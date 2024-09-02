import { FC } from 'react';
import { Link } from 'wouter';

export const Home: FC = () => {
  return (
    <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8 my-12">
      {/* Hero Section */}
      <section className="text-center mt-24 mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Predict Bitcoin's next move!
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-400">
          Set a timeframe, bet amount and make a prediction. If you're right, we
          double your bet!
        </p>
        <Link
          href="/game/new"
          className="btn btn-primary text-black btn-lg mt-6"
        >
          Ok, lemme predict 🔮
        </Link>
      </section>

      <div className="divider"></div>

      {/* Middle Section */}
      <section className="my-12">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-4xl">
          Inspect game & Regret nothing
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-400">
          Whether your game is still running or already settled, you can view
          the details anytime and laugh at how your prediction was based on
          absolutely nothing!
        </p>
        <div className="flex justify-center mt-6">
          <div className="w-96 border border-gray-800">
            <img src="/game-details.png" />
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Last Section */}
      <section className="my-12">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-4xl">
          View game history & Accept the reality
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-400">
          Relive your glorious wins and embarrassing losses. Check out the list
          of all your past games at{' '}
          <Link href="/games" className="text-blue-500">
            My Games
          </Link>
          .
        </p>
        <div className="flex justify-center mt-6">
          <div className="w-96 border border-gray-800">
            <img src="/game-list.png" />
          </div>
        </div>
      </section>
    </div>
  );
};
