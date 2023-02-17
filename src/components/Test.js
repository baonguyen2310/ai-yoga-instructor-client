import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

let interval;
const Test = () => {

    const [count, setCount] = useState(0);

    const previousCountRef = useRef();
    //previousCountRef.current = false;

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
        setCount(prev => prev + gap);  //count phía dưới h2 là count của setState bình thường nên nó cập nhật giá trị
        //console.log(count); //biến count này là biến được dùng trong phạm vi scope đầu tiên nên luôn nhận giá trị initial
        //set rồi dùng phía dưới thì được, nhưng dùng trong đây thì không được
        //Cách giải quyết: dùng useRef thay vì useState
        if (previousCountRef.current == true){
            previousCountRef.current = false;
        } else {
            previousCountRef.current = true;
        }
        console.log(previousCountRef.current);
        requestAnimationFrame(() => {
            runMovenet2(gap);
        });
    }

    const handleClick2 = () => {
        runMovenet2(1);
    }

    useEffect(() => {
        tf.loadLayersModel("./models/model.json")
            .then((model) => {
                console.log(model.summary());
            })
    }, [])

    console.log(count);

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