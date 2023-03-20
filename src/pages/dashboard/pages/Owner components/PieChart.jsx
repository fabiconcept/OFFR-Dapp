import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { contextData } from '../../dashboard';
import { ethers } from 'ethers';
import { ABI3, address3 } from '../../../../util/constants/tokenHandlerContract';

const PieChart = () => {
    const {coinBase} = useContext(contextData);
    const [ daysObj, setDaysObj ] = useState([]);

    const fetchTokenSupply = async() =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();

        const OffrToken = new ethers.Contract(address3, ABI3, signer);

        const tokenSale = await OffrToken.tokensale_open();
    }

    useEffect(()=>{
        if (coinBase) {
            fetchTokenSupply();
        }
    }, [coinBase]);

    useEffect(()=>{
        if (daysObj.length > 0) {
            const xAxis = [];
            const seriesData = [];

            setChartOptions({
                options: {
                    chart: {
                      id: 'basic-pie'
                    },
                    labels: ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'],
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: 200
                        },
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }]
                  },
                  series: [44, 55, 13, 43, 22],
            }
            );
        }
    }, []);

    return (
        <div className="kard exempt">
            <div className="title">Last 7 days Token Sale</div>
            <div className="barchart">
                <Chart

                    options={chartOptions.options}
                    series={chartOptions.series}
                    type={"pie"}
                    height={268}
                />
            </div>
        </div>
    )
}

export default PieChart;