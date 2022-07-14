import './App.css';
import {ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {useEffect, useState} from "react";
import paparse from "papaparse"
import mercadolibre from "./mercadolibre.csv"


function App() {

    const renderTooltip = (props) => {
        const { active, payload } = props;

        console.log(props)
        if (active && payload && payload.length) {
            const data = payload[0] && payload[0].payload;

            return (
                <div
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #999',
                        margin: 0,
                        padding: 10,
                    }}
                >
                    <p>{data.hour}</p>
                    <p>
                        <span>value: </span>
                        {info[0]}
                    </p>
                </div>
            );
        }

        return null;
    };
    const [info, setInfo] = useState([])
    const range = [16, 2250];
    let domain ;
    const Carge = async () => {

        await paparse.parse(mercadolibre, {
            download: true,
            header: true,
            complete: (a) => {
                setInfo(a.data.map((el) => ({
                    x: Number(el.rating), y: Number(el.opinionsTotal), z: Number(el.sales)
                })))
            }
        })

        const parseDomain = () => [
            0,
            Math.max(
                Math.max.apply(
                    null,
                    info.map((entry) => entry.value),
                )
            ),

        ];
        domain = parseDomain();
    }

    useEffect(() => {

        Carge()

    }, [])

    return (

        <div>

            <div>

                <ScatterChart
                    width={1400}
                    height={900}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid x={5}/>
                    <XAxis type="number" dataKey="x" name="rating" />
                    <YAxis type="number" dataKey="y" name="opinionTotal"/>
                    <ZAxis type="number" dataKey="z" name="sales" domain={domain} range={range} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip(info)} />
                    <Scatter name="A school" data={info} fill="#8884d8" animationDuration={200}/>
                </ScatterChart>
            </div>


        </div>

    );
}

export default App;
