import { useState } from "react";
// import "./App.css";

function Button({ handleClick, text }) {
  return <button onClick={handleClick}>{text}</button>;
}

function StatsLine({ text, value }) {
  return (
    <tr>
      <td>{text}</td>
      <td>{":" + value}</td>
    </tr>
  );
}

function Stats({ feedback }) {
  const sum = feedback.good + feedback.neutral + feedback.bad;
  const average = (feedback.good - feedback.bad) / sum;
  const positve = (feedback.good / sum) * 100;


  if ( sum === 0) {
    return <p>No Feedback Given</p>;
  }

  return (
    <table>
      <tbody>
        <StatsLine value={feedback.good} text="Good" />
        <StatsLine value={feedback.neutral} text="Neutral" />
        <StatsLine value={feedback.bad} text="Bad" />
        <StatsLine value={sum} text="All" />
        <StatsLine value={average} text="Average" />
        <StatsLine value={positve ? positve + "%" : 0} text="Positve" />
      </tbody>
    </table>
  );
}

function App() {

  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
  });

  const buttons = ["Good", "Neutral", "Bad", "Reset"];

  function handleClick(butt) {

    const clickOnGood = function () {
      const newFeedback = {
        ...feedback,
        good: feedback.good + 1,
      };
      setFeedback(newFeedback);
    };

    const clickOnNeutral = function () {
      const newFeedback = {
        ...feedback,
        neutral: feedback.neutral + 1,
      };
      setFeedback(newFeedback);
    };

    const clickOnBad = function () {
      const newFeedback = {
        ...feedback,
        bad: feedback.bad + 1,
      };
      setFeedback(newFeedback);
    };

    const clickOnReset = function () {
      const newFeedback = {
        bad: 0,
        good: 0,
        neutral: 0,
      };
      setFeedback(newFeedback);
    };

    return butt === "Good" ? clickOnGood
      : butt === "Neutral" ? clickOnNeutral
      : butt === "Bad" ? clickOnBad
      : clickOnReset;
  }

  return (
    <div>
      <h1>Give feedback</h1>
      {buttons.map((button) => (
        <Button handleClick={handleClick(button)} text={button} key={button} />
      ))}
      <h1>Stats</h1>
      <Stats feedback={feedback} /> 
    </div>
  );
}

export default App;
