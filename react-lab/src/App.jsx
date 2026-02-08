import { useState } from "react"


function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  function countIncrease() {
    setCount(count + 1);
  }
  function countDecrease() {
    setCount(count - 1);
  }
  function countReset() {
    setCount(0);
  }
  function textInput(e) {
    const inputText = e.target.value;
    setText(inputText);

  }
  // If count is 0, use 'white' (or black).
  // If count > 0, use 'green'.
  // Otherwise (negative), use 'red'.
  const countColor = count === 0 ? 'white' : count > 0 ? 'green' : 'red';
  return (
    <>
    <section>
      <h1 style={{color: countColor}}>Count: {count}</h1>
      <button onClick={countIncrease}>+1</button>
      <button onClick={countDecrease}>-1</button>
      <button onClick={countReset}>RESET</button>  
    </section>
    <hr/>
    <section>
      <h2>Mirror</h2>
      <p>What you're typing: {text}</p>
      <input type="text" placeholder="Type here..." value={text} onChange={textInput}/>
    </section>
    </>
  )
}

export default App
