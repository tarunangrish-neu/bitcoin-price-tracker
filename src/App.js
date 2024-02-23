import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './App.css';


const api_url = 'https://api.bitaps.com/market/v1/ticker/btcusd';

async function getCoinData() {
  const response = await fetch(api_url);
  return response.json();
}

const chartOptions = {
  chart: {
    type: 'line',
    height: 600,
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 200,
      },
    },
    autoScaleYaxis: true,
    },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        {
          offset: 0,
          color: "#EB656F",
          opacity: 1
        },
        {
          offset: 20,
          color: "#FAD375",
          opacity: 1
        },
        {
          offset: 60,
          color: "#61DBC3",
          opacity: 1
        },
        {
          offset: 100,
          color: "#95DA74",
          opacity: 1
        }
      ]
    }
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: '#ffffff',
      }
    },
  },
  yaxis: {
    show: true,
    tooltip: {
      enabled: true,
    },
    labels: {
      style: {
        colors: '#ffffff',
      }
    },
  },
  markers: {
    size: 5,
  },
  tooltip: {
    theme: 'dark',
    x:{
      show: true,
      format: 'dd MMM HH:mm:ss',
      },
    y: {
      show: true,
      title: {
        formatter: (seriesName) => 'BTC/USD in UTC',
      },
      formatter: (value) => {
        return `$${value}`;
      },
    }
  }
};

function App() {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);
  const [price, setPrice] = useState(-1);
  const [previousPrice, setPreviousPrice] = useState(-1);
  const [openPrice, setOpenPrice] = useState(-1);
  const [highPrice, setHighPrice] = useState(-1);
  const [lowPrice, setLowPrice] = useState(-1);
  const [volume, setVolume] = useState(-1);
  const [lastChange, setLastChange] = useState(-1);
  const [lastChangePercentage, setLastChangePercentage] = useState(-1);
  const [directionLastChange, setDirectionLastChange] = useState('');
  const [directionLastChangePercentage, setDirectionLastChangePercentage] = useState('');

  useEffect(() => {
    let intervalID;

    const getLatestMarketData = async () => {
      try {
        const data = await getCoinData();
        const btcusd = data.data;

        setPreviousPrice(price);
        setPrice(btcusd.last);
        setOpenPrice(btcusd.open);
        setHighPrice(btcusd.high);
        setLowPrice(btcusd.low);
        setVolume(btcusd.volume);
        setLastChange(btcusd.last_change);
        setLastChangePercentage((parseFloat((btcusd.last_change)/(btcusd.last))*10000).toFixed(2));
        const timestamp = new Date().getTime();
        const close = btcusd.last;
        const singleCandlestickData = {
          x: timestamp,
          y: close,
        };

        setSeries((prevSeries) => {
          const newCandlestickDataArray = [...prevSeries[0].data, singleCandlestickData];

          if (newCandlestickDataArray.length > 50) {
            newCandlestickDataArray.shift();
          }

          return [
            {
              data: newCandlestickDataArray,
            },
          ];
        });

        setDirectionLastChange(() => (
          btcusd.last_change < 0 ? 'down' : btcusd.last_change > 0 ? 'up' : ''
        ));

        setDirectionLastChangePercentage(() => (
          btcusd.last_change < 0 ? 'down' : btcusd.last_change > 0 ? 'up' : ''
        ));
        
      } catch (e) {
        console.error(e);
      }
    };

    intervalID = setInterval(getLatestMarketData, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, [price, previousPrice]);

  return (
    <div className='Body'>
      <div className="pt-2">
        <div className="btc-header">BTC/USD Last 24 hours</div>
      <div className="d-flex flex-row justify-content-around p-1">
        <div className="bold text-left w-100">
        <div className="d-flex flex-row">
          <div className = "component-wide">O</div>
            <div>
            <b><span>{openPrice}</span></b>
            </div>
          </div>
        <div className="d-flex flex-row">
            <div className = "component-wide">H</div>
              <div>
              <b><span>{highPrice}</span></b>
              </div>
            </div>
        <div className="d-flex flex-row ">
            <div className = "component-wide">L</div>
              <div>
                <b><span>{lowPrice}</span></b>
              </div>
            </div>
        <div className="d-flex flex-row ">
            <div className = "component-wide">V</div>
              <div>
              <b><span>{volume}</span></b>
              </div>
            </div>
        </div>
        <div>
          <h2 className="text-right pr-1 mb-0 pb-0 price-header">
          <small>$</small><b>{price}</b>
          </h2>
        <div className="bold text-right w-100 average-change">
          <div className="bold text-right w-100 smaller">
            <div>
              <span className={`${directionLastChange}`}>{lastChange}</span>
            </div>
          </div>
        <div className="bold text-right w-100 smaller">
          <div>
              <span className={`${directionLastChangePercentage}`}>{lastChangePercentage}%</span>
          </div>
        </div>
  </div>
      </div> 
      </div>
      <div>
        <Chart options={chartOptions} series={series} type="line" width="100%" height={350}/>
      </div>
    </div>
    </div>
  );
}

export default App;
