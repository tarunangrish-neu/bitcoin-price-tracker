import React, { useState, useEffect } from 'react';
import './App.css';
import fetchData from './price-stats.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

function App() {
  const [responseData, setResponseData] = useState();
  const [prevPrice, setPrevPrice] = useState();
  const [chartData, setChartData] = useState < ChartData < 'line' >> ({})
  const [chartOptions, setChartOptions] = useState < ChartOptions < 'line' >> ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'BTC/USD Last 24 hours',
      },
    }
  }
  );
  useEffect(() => {
    const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=14';
    axios.get(url).then((response) => {
      console.log(response.data);
      setChartData({
        labels: response.data.prices.map((price) => price[0]),
        datasets: [
          {
            label: 'Price',
            data: response.data.prices.map((price) => price[1]),
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
    }
    )
  })

  const fetchDataAndSetState = async () => {
    try {
      const data = await fetchData();
      const result = data.filter((element) => element.id === "bitcoin");
      if (result.length > 0) {
        setPrevPrice(responseData?.current_price || 0);
        setResponseData(result[0]);
      } else {
        console.error("Bitcoin data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataAndSetState();
    const interval = setInterval(() => {
      fetchDataAndSetState();
    }, 10000);
    return () => clearInterval(interval);
  },);

  const getColorBasedOnChange = () => {
    const priceChange = responseData.current_price - prevPrice;
    return priceChange > 0 ? 'green' : priceChange < 0 ? 'red' : 'white';
  };

  return (
    <div className="Body">
      <h2>BTC/USD Last 24 hours</h2>
      {responseData && (
        <div>
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              borderRadius: "25px",
              margin: "25px",
              justifyContent: "left",
            }}>
              <div>O: {responseData.open_24h}</div>
              <div>H: {responseData.high_24h}</div>
              <div>L: {responseData.low_24h}</div>
              <div>V: {responseData.total_volume}</div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              borderRadius: "25px",
              margin: "25px",
              justifyContent: "left",
            }}>
              <div style={{
                color: getColorBasedOnChange(),
                fontSize: "30px",
              }}>
                Current Price: {responseData.current_price}
              </div>
              <div style={{ color: getColorBasedOnChange() }}>{responseData.price_change_24h}</div>
              <div style={{ color: getColorBasedOnChange() }}>{responseData.price_change_percentage_24h}</div>
            </div>
          </div>
          <div><Line options={chartOptions} data={chartData} /> </div>
        </div>
      )}
      </div>)}

      export default App;
