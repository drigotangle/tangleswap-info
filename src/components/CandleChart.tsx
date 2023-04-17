import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

interface OhlcData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  data: OhlcData[];
}

const CandleChart: React.FC<Props> = ({ data }) => {
  console.log(data)
const options: ApexOptions = {
  chart: {
    type: "candlestick",
    height: 350,
    id: "ohlc-chart",
    toolbar: {
      autoSelected: "zoom",
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: "#4CAF50",
        downward: "#F44336"
      }
    }
  },
  series: [
    {
      data: data.map((d) => ({
        x: new Date(d.time).getTime(),
        y: [d.open, d.high, d.low, d.close]
      }))
    }
  ]
};
return data.length > 0 ? <Chart options={options} /> : <></>
};

export default CandleChart;
