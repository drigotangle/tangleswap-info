import React, { useContext, useEffect, useState, useRef } from 'react';
import { Card, Skeleton, Typography } from "@mui/material";
import styled, { keyframes } from "styled-components";
import { AppContext, initialState } from "../state";
import { IToken } from '../interfaces';
import { PriceChangeSpan } from '.';
import { xLogo, logo } from '../constants';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TokenImage = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 10px;
`;

const TreadmillWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const TreadmillCard = styled(Card)`
  width: 250px;
  height: 80px;
  margin: 0 8px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

const treadAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const TreadmillContainer = styled.div`
  width: 100%;
  display: flex;
  animation: ${treadAnimation} 30s linear infinite;
`;

const Treadmill = ({ children }: any) => {
    const TreadmillWrapperRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const treadmillCardWidth = 250;
    const treadmillSpacing = 16;

    useEffect(() => {
        const resizeHandler = () => {
            setContainerWidth(TreadmillWrapperRef.current?.offsetWidth ?? 0);
        }

        window.addEventListener('resize', resizeHandler);
        resizeHandler();

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    return (
        <TreadmillWrapper ref={TreadmillWrapperRef}>
            <TreadmillContainer style={{ transform: `translateX(${-containerWidth}px)` }}>
                {React.Children.map(children, (child, i) => {
                    return (
                        <div style={{ width: `${treadmillCardWidth + treadmillSpacing}px` }}>
                            {child}
                        </div>
                    )
                })}
                {React.Children.map(children, (child, i) => {
                    return (
                        <div style={{ width: `${treadmillCardWidth + treadmillSpacing}px` }}>
                            {child}
                        </div>
                    )
                })}
            </TreadmillContainer>
        </TreadmillWrapper>
    );
};

const TopMoversCard = () => {
    const { state } = useContext(AppContext);
    const { tokenData, usdPrice } = state;

    if (state.tokenData === initialState.tokenData) {
        return (<><Typography variant="subtitle1" component="p">Loading top movers...</Typography><br /><Skeleton variant="rectangular" width={600} height={80} /></>)
    }

    return (
        <Treadmill>
            {state.tokenData.map((data: IToken | any) => {
                return (
                    <TreadmillCard key={data.tokenAddress}>
                        <TokenImage src={logo[data.tokenAddress] ?? xLogo} />
                        <div style={{ flexGrow: 1, marginRight: "16px" }}>
                            <Typography variant="subtitle1" component="p">
                                {data.tokenSymbol}
                            </Typography>
                            <Typography variant="h4" component="p">
                                {`$${Number(data.lastPrice * usdPrice).toFixed(2)}`}
                            </Typography>
                            <Typography variant="h4" component="p">
                                <PriceChangeSpan priceChange={data.priceChange / 100}>{isNaN(data.priceChange / 100) ? 0 : `${data.priceChange / 100}%`}</PriceChangeSpan>
                            </Typography>
                        </div>
                    </TreadmillCard>
                )
            })}
        </Treadmill>
    );
};

export default TopMoversCard;
