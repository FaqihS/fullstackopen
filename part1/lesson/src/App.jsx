import { useState } from "react";
import "./App.css";

const Part1c = () => {
  const Display = ({ counter }) => {
    return <div>{counter}</div>;
  };

  const Button = ({ handleClick, text }) => {
    return <button onClick={handleClick}>{text}</button>;
  };
  const [counter, SetCounter] = useState(0);

  const increaseByOne = () => {
    SetCounter(counter + 1);
  };

  const decreaseByOne = () => {
    SetCounter(counter - 1);
  };
  const setToZero = () => {
    SetCounter(0);
  };

  return (
    <div>
      <Display counter={counter} />
      <Button handleClick={increaseByOne} text="+" />
      <Button handleClick={setToZero} text="0" />
      <Button handleClick={decreaseByOne} text="-" />
    </div>
  );
};

const ComplexState = () => {
  const [click, SetClick] = useState({
    left: 0,
    right: 0,
  });

  const HandleClickLeft = () => {
    SetClick({
      ...click,
      left: click.left + 1,
    });
  };

  const HandleClickRight = () => {
    const newClick = {
      ...click,
      right: click.right + 1,
    };
    SetClick(newClick);
  };

  return (
    <div>
      {click.left}
      <button onClick={HandleClickLeft}>Left</button>
      <button onClick={HandleClickRight}>Right</button>
      {click.right}
    </div>
  );
};

const Dbg = () => {
  const History = ({ allClicks }) => {
    if (allClicks.length) {
      return <div>button pressed history : {allClicks.join(" ")}</div>;
    }
    return <div>the app used by pressing buttons</div>;
  };
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);

  const handleClick = (but) => {
    const clickLeft = () => {
      setAll(allClicks.concat("L"));
      const newLeft = left + 1;
      setLeft(newLeft);
      setTotal(newLeft + right);
    };
    const clickRight = () => {
      setAll(allClicks.concat("R"));
      const newRight = right + 1;
      setRight(newRight);
      setTotal(left + newRight);
    };
    return but === "left" ? clickLeft : but === "right" ? clickRight : "";
  };

  return (
    <div>
      {left}
      <Button handleClick={handleClick("left")} text="Left" />
      <Button handleClick={handleClick("right")} text="Right" />
      {right}
      <History allClicks={allClicks} />
      <p>Total : {total}</p>
    </div>
  );
};

const Button = ({handleClick,text}) => {
  return <button onClick={handleClick}> {text} </button>
}
const Display = ({value}) => {
  return <div>{value}</div>
}

const App = () => {
  const [value, setValue] = useState(0);
  const setToValue = (newValue) => () => {
    console.log("value now", newValue);
    setValue(newValue);
  };

  return (
    <div>
      <Display value={value} />
      <Button handleClick={setToValue(value+1)} text="+1" />
      <Button handleClick={setToValue(value+2)} text="+2" />
      <Button handleClick={setToValue(0)} text="0" />
    </div>
  );
};

export default App;
