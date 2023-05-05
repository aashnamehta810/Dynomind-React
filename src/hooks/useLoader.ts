import { useState } from 'react';

type UseLoader = () => {
  loader: boolean;
  handleLoaderOpen: () => void;
  handleLoaderClose: () => void;
};

export const useLoader: UseLoader = () => {
  const [loader, setLoader] = useState(false);

  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const handleLoaderClose = () => {
    setLoader(false);
  };

  return {
    loader,
    handleLoaderOpen,
    handleLoaderClose,
  };
};
