import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from '../Select/Select';
import { getStatistics, Statistic } from 'api/statistics.api';

export const StatisticsSelect: React.FC<SelectProps> = ({ className, ...props }) => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  useEffect(() => {
    getStatistics().then((res) => setStatistics(res));
  }, []);

  return <Select className={className} options={statistics} {...props}></Select>;
};
