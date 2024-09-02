import { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="footer bg-base-200 p-10">
      <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8">
        <aside>
          <span className="text-4xl font-bold">₿🔮🤞🤷‍♂️</span>
          <p className="text-2xl">
            LemmePredict
            <br />
            <span className="text-sm">Proving your luck is not luck since 2024</span>
          </p>
        </aside>
      </div>
    </footer>
  );
};
