import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@app/components/common/buttons/Button/Button';
import { FilterIcon } from '@app/components/common/icons/FilterIcon';
import { Modal } from '@app/components/common/Modal/Modal';
import { NFTCardHeader } from '@app/components/dashboard/common/NFTCardHeader/NFTCardHeader';
import { RecentActivityFilter } from '@app/components/dashboard/recentActivity/recentActivityFilters/RecentActivityFilter';
import { RecentActivityFilterState } from '@app/components/dashboard/recentActivity/RecentActivity';
import { useResponsive } from '@app/hooks/useResponsive';

interface RecentActivityHeaderProps {
  filters: RecentActivityFilterState;
  setFilters: (func: (state: RecentActivityFilterState) => RecentActivityFilterState) => void;
}

export const RecentActivityHeader: React.FC<RecentActivityHeaderProps> = ({ filters, setFilters }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  return (
    <>
      <NFTCardHeader title={t('nft.recentActivity')}>
        {!isDesktop && (
          <Button size="large" noStyle type="text" icon={<FilterIcon />} onClick={() => setModalOpen(true)} />
        )}
      </NFTCardHeader>

      {!isDesktop && (
        <Modal open={isModalOpen} onCancel={() => setModalOpen(false)} footer={null}>
          <RecentActivityFilter filters={filters} setFilters={setFilters} />
        </Modal>
      )}
    </>
  );
};
