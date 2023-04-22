import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface OhlcData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  props: OhlcData[];
}

const CandleChart: React.FC<Props> = ({ props }) => {
  console.log(
    JSON.stringify(props.map((d) => ({
      x: dayjs(d.timestamp).format('DD-MM'),
      y: [d.open, d.high, d.low, d.close]
    }))),
    'data from the chart'
  )
  if (!props || props.length === 0) {
    return <div>No data available</div>;
  }
const options: any = {
  chart: {
    type: 'candlestick',
    height: 500,
    with: 300
  },
  candlestick: {
    colors: {
      upward: '#3C90EB',
      downward: '#DF7D46'
    }
  },
  title: {
    text: 'CandleStick Chart',
    align: 'left'
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  },
  theme: {
    monochrome: {
      enabled: true,
      color: '#255aee',
      shadeTo: 'light',
      shadeIntensity: 0.65
    }
  }
}

const series = [{
  data: props.map((d) => ({
    x: new Date(d.timestamp),
    y: [d.open, d.high, d.low, d.close]
  }))
}]
return <ReactApexChart options={options} series={series} type="candlestick" />;
};

export default CandleChart;
