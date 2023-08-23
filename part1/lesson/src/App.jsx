import './App.css'

const Hello = (props) => {
  console.log(props)
  return (
  <>
   <p>Hello {props.name}{props.age ? `, you are ${props.age} old`: ""}</p>
  </>
  )
}

const App = () => {
  const name = "Rommy"
  const age = 10
  return (
  <div>
    <h1>Greetings</h1>
    <Hello name={name}/>
    <Hello name="Dennis" age={age + 1}/>
  </div>
  )
}

export default App
