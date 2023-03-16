import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartWrapper } from '.';
import { getPools } from '../functions';

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  data: CandlestickData[];
}

const CandleChart: React.FC<Props> = ({ data }) => {

    const options: ApexCharts.ApexOptions = {
        chart: {
          id: 'candlestick-chart',
          toolbar: {
            show: false
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'dd MMM yyyy'
          }
        },
        yaxis: {
          labels: {
            formatter: function(value: number) {
              return `$${value}`;
            }
          }
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#3C90EB',
              downward: '#DF7D46'
            }
          }
        },
        series: [{
          data: data.map(({ time, open, high, low, close }) => ({
            x: time,
            y: [open, high, low, close]
          }))
        }]
      };

      const vwWidth = window.innerWidth * (60 / 100);
      

  return (
    <ChartWrapper>
        <Chart width={vwWidth} options={options} series={options.series} />
    </ChartWrapper>
  );
};

export default CandleChart;
