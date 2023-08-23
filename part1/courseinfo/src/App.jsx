
const App = () => {

  const Header = () =>  <h1>{course}</h1>

  const Part = props =>  <p>{props.part} {props.exercise}</p>
  const Content = () => {
    return( <>
      <Part  part={part1} exercise={exercises1}/>
      <Part  part={part2} exercise={exercises2}/>
      <Part  part={part3} exercise={exercises3}/>
      </>)
  }
  const Total = () => <p>Number of Exercises {exercises1 + exercises2 + exercises3} </p>

  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header />
      <Content/>
      <Total  />
    </div>
  )
}

export default App
