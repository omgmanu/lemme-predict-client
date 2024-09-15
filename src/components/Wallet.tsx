import { FC, useRef, useState } from 'react';
import { useUserContext } from '../providers/UserContextProvider';
import { ConnectWithXButton } from './ConnectWithXButton';
import axios from 'axios';

export const Wallet: FC = () => {
  const { user } = useUserContext();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container mx-auto max-w-60 my-52 ">
        <ConnectWithXButton />
      </div>
    );
  }

  const handleRevealPrivateKey = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/profile/private-key`, {
        withCredentials: true,
      })
      .then((res) => {
        setPrivateKey(res.data.privateKey);
      });
  };

  return (
    <div className="container mx-auto max-w-2xl md:max-w-4xl px-6 lg:px-8 my-12">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Wallet
      </h1>
      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Export Private Key</h3>
          <p className="py-4">
            You are about to export your private key. This is a sensitive
            operation and should be done with caution.
          </p>
          <p className="py-4">
            Your private key will be displayed below. Please copy it and store
            it securely.
          </p>
          {privateKey ? (
            <textarea
              className="textarea textarea-bordered w-full"
              value={privateKey}
            />
          ) : (
            <button
              className="btn btn-primary mb-4 btn-md w-full"
              onClick={handleRevealPrivateKey}
            >
              Reveal private key
            </button>
          )}
        </div>
      </dialog>

      <p className="mt-6 text-md leading-6 text-gray-400">
        Here you can see your wallet address and balance. You can also retrieve
        your private key.
      </p>
      <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="mt-10 flex flex-col game-details">
          <div className="flex items-center mb-4">
            <div className="icon mr-4">💼</div>
            <div>
              <div className="text-sm font-medium text-gray-500">
                Wallet Address
              </div>
              <div className="text-lg">{user?.publicKey?.toBase58()}</div>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="icon mr-4">💰</div>
            <div>
              <div className="text-sm font-medium text-gray-500">SOL Balance</div>
              <div className="text-lg">TBA</div>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="icon mr-4">🔑</div>
            <div>
              <div className="text-sm font-medium text-gray-500">
                Export Wallet
              </div>
              <div className="text-lg">
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => {
                    modalRef.current?.showModal();
                    setPrivateKey(null);
                  }}
                >
                  Show Private Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
