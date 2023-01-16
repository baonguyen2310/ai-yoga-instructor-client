import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

let interval;
const Test = () => {

    const [count, setCount] = useState(0);

    const runMovenet = () => {
        console.log("running");
        setCount(prev => prev + 1);
    }

    const handleClick = () => {
        console.log("handle Click");
        interval = setInterval(() => {runMovenet()}, 1000);
    }

    //handleClick();

    const runMovenet2 = (gap) => {
        console.log("running");
        setCount(prev => prev + gap);
        requestAnimationFrame(() => {
            runMovenet2(gap);
        });
    }

    const handleClick2 = () => {
        runMovenet2(1);
    }

    useEffect(() => {
        tf.loadLayersModel("http://localhost:3000/models/model.json")
            .then((model) => {
                console.log(model.summary());
            })
    }, [])


    return (
        <div>
            <h1>Test</h1>
            <h2>{count}</h2>
            <button onClick={handleClick}>Click</button>
            <button onClick={handleClick2}>Click</button>
        </div>
    )
}

export default Test;