import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from '@app/components/common/Carousel/Carousel';
import { ViewAll } from '@app/components/dashboard/common/ViewAll/ViewAll';
import { NFTCardHeader } from '@app/components/dashboard/common/NFTCardHeader/NFTCardHeader';
import { TrendingCollection } from '@app/components/dashboard/trending-collections/collection/TrendingCollection';
import { useResponsive } from '@app/hooks/useResponsive';
import { getTrendingActivities, TrendingActivity } from '@app/api/activity.api';
import * as S from './TrendingCollections.styles';

export const TrendingCollections: React.FC = () => {
  const [trending, setTrending] = useState<TrendingActivity[]>([]);

  const { mobileOnly, isTablet: isTabletOrHigher } = useResponsive();

  useEffect(() => {
    getTrendingActivities().then((res) => setTrending(res));
  }, []);

  const { t } = useTranslation();

  const trendingList = useMemo(() => {
    return {
      mobile: trending.map((item, index) => <TrendingCollection key={index} {...item} />).slice(0, 3),
      tablet: trending.map((item, index) => (
        <div key={index}>
          <S.CardWrapper>
            <TrendingCollection {...item} />
          </S.CardWrapper>
        </div>
      )),
    };
  }, [trending]);

  const sliderRef = useRef<Slider>(null);

  return (
    <>
      <NFTCardHeader title={t('nft.trendingCollections')}>
        {isTabletOrHigher && (
          <Row align="middle">
            <Col>
              <ViewAll bordered={false} />
            </Col>

            <Col>
              <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickPrev()}>
                <LeftOutlined />
              </S.ArrowBtn>
            </Col>

            <Col>
              <S.ArrowBtn type="text" size="small" onClick={() => sliderRef.current && sliderRef.current.slickNext()}>
                <RightOutlined />
              </S.ArrowBtn>
            </Col>
          </Row>
        )}
      </NFTCardHeader>

      <S.SectionWrapper>
        {mobileOnly && trendingList.mobile}

        {isTabletOrHigher && trending.length > 0 && (
          <Carousel
            ref={sliderRef}
            slidesToShow={3}
            responsive={[
              {
                breakpoint: 1900,
                settings: {
                  slidesToShow: 2,
                },
              },
            ]}
          >
            {trendingList.tablet}
          </Carousel>
        )}
      </S.SectionWrapper>

      {mobileOnly && (
        <S.ViewAllWrapper>
          <ViewAll />
        </S.ViewAllWrapper>
      )}
    </>
  );
};
