import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { CalendarSwitch } from '@app/components/common/CalendarSwitch/CalendarSwitch';
import { CalendarEvent } from '@app/api/calendar.api';
import { AppDate, Dates } from '@app/constants/Dates';
import * as S from './TreatmentCalendar.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface TreatmentCalendarProps {
  date: AppDate;
  setDate: (state: AppDate) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onToday: () => void;
  setDateClicked: (state: boolean) => void;
  calendar: CalendarEvent[];
}

export const TreatmentCalendar: React.FC<TreatmentCalendarProps> = ({
  calendar,
  date,
  setDate,
  onDecrease,
  onIncrease,
  setDateClicked,
  onToday,
}) => {
  const translation = useAppSelector((state) => state.translation);
  const [locale, setLocale] = useState();
  const handleSelect = (value: AppDate) => {
    setDate(value);
    setDateClicked(true);
  };

  useEffect(() => {
    (async () => {
      const data = await import(`antd/es/locale/${translation.localHelper}`);
      setLocale(data);
    })();
  }, [translation]);

  const dateFormatted = Dates.format(date, 'MMMM YYYY');

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <CalendarSwitch
            dateFormatted={dateFormatted}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            onToday={onToday}
          />
        </Col>

        <Col span={24}>
          <S.Calendar
            locale={locale}
            dateCellRender={(value) => {
              const today = Dates.getToday();

              return calendar.map((event) => {
                const calendarDate = Dates.getDate(event.date);

                if (
                  calendarDate.isSame(value, 'date') &&
                  calendarDate.isSame(value, 'month') &&
                  calendarDate.isSame(value, 'year')
                ) {
                  const isPast = today.isAfter(calendarDate);

                  return (
                    <S.Event key={event.date} $isPast={isPast}>
                      {calendarDate.format('DD')}
                    </S.Event>
                  );
                }
              });
            }}
            value={date}
            fullscreen={false}
            onSelect={handleSelect}
          />
        </Col>
      </Row>
    </>
  );
};
