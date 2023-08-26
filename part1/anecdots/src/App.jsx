import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Anecdot = ({ text, vote }) => {
  return (
    <>
      <p>
        <b>
          <i>{text}</i>
        </b>
      </p>
      <p> Vote : {vote} </p>
    </>
  );
};
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);

  const mostVoted = points.reduce(
    (largest, point, i) => {
      return point > largest.votes
        ? (largest = { id: i, votes: point })
        : largest;
    },
    { id: 0, votes: 0 }
  );

  const handleClick = (butt) => {
    const clickNext = () => {
      let newSelect = selected;
      while (newSelect == selected) {
        newSelect = Math.floor(Math.random() * anecdotes.length);
      }
      setSelected(newSelect);
    };
    const clickVote = () => {
      const newVote = points.map((v, i) => (i == selected ? v + 1 : v));
      setPoints(newVote);
    };

    return butt === "next" ? clickNext : butt === "vote" ? clickVote : () => "";
  };

  return (
    <div>
      <h1>Quote of The Day </h1>
      <Anecdot text={anecdotes[selected]} vote={points[selected]} />
      <Button handleClick={handleClick("next")} text="Next" />
      <Button handleClick={handleClick("vote")} text="Vote" />

      <h1>Most Voted Quote</h1>
      <Anecdot text={anecdotes[mostVoted.id]} vote={mostVoted.votes} />
    </div>
  );
};

export default App;
