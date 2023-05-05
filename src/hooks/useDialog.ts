import { useState } from 'react';

/**
  This hook is used to toggle modals
*/
type UseDialog = () => {
  dialogOpen: boolean;
  handleDialogOpen: () => void;
  handleDialogClose: () => void;
};

export const useDialog: UseDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return {
    dialogOpen,
    handleDialogOpen,
    handleDialogClose,
  };
};
