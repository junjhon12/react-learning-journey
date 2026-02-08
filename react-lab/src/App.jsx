import { useState } from "react"


function App() {
  const [count, setCount] = useState(0);

  function countIncrease() {
    setCount(count + 1);
  }
  function countDecrease() {
    setCount(count - 1);
  }
  function countReset() {
    setCount(0);
  }
  // If count is 0, use 'white' (or black).
  // If count > 0, use 'green'.
  // Otherwise (negative), use 'red'.
  const countColor = count === 0 ? 'white' : count > 0 ? 'green' : 'red';
  return (
    <>
      <h1 style={{color: countColor}}>Count: {count}</h1>
      <button onClick={countIncrease}>+1</button>
      <button onClick={countDecrease}>-1</button>
      <button onClick={countReset}>RESET</button>
    </>
  )
}

export default App
