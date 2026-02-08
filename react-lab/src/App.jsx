import { useState, useEffect } from "react"

function App() {
  // --- THE VAULT (State) ---
  // Think of these as your app's memory. If these change, React re-renders the UI.
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [time, setTime] = useState(0);

  // --- THE WORKOUTS (Event Handlers) ---
  
  // Straightforward: Grab the current count and bump it up.
  function countIncrease() {
    setCount(count + 1);
  }

  // Dropping the weight.
  function countDecrease() {
    setCount(count - 1);
  }

  // Back to baseline.
  function countReset() {
    setCount(0);
  }

  // Listening to the keyboard. Every keystroke triggers this 'e' (event).
  function textInput(e) {
    const inputText = e.target.value; // Grabbing what you typed
    setText(inputText); // Saving it to the vault
  }

  // --- THE BACKGROUND HUSTLE (Effects) ---
  
  useEffect(() => {
    // This starts as soon as the component hits the screen (mounts).
    const interval = setInterval(() => {
      // PRO TIP: Using a functional update (seconds => seconds + 1) 
      // is the elite way to do this. It ensures you always have the latest value.
      setTime(seconds => seconds + 1);
      console.log("Tick...");
    }, 1000);

    // THE CLEANUP: Don't be that guy who leaves the weights out. 
    // This stops the timer if the component disappears, preventing memory leaks.
    return () => clearInterval(interval);
  }, []); // The empty array [] means "Only run this once on start."

  // --- THE STYLE LOGIC ---
  // Clean ternary operator here. It's like a quick 'if-else' to decide the vibe.
  const countColor = count === 0 ? 'white' : count > 0 ? 'green' : 'red';

  return (
    <>
    {/* SECTION 1: THE COUNTER */}
    <section>
      {/* Dynamic styling! The color changes based on your logic above. */}
      <h1 style={{color: countColor}}>Count: {count}</h1>
      <button onClick={countIncrease}>+1</button>
      <button onClick={countDecrease}>-1</button>
      <button onClick={countReset}>RESET</button>  
    </section>
    
    <hr/>

    {/* SECTION 2: THE MIRROR */}
    <section>
      <h2>Mirror</h2>
      <p>What you're typing: {text}</p>
      {/* This is a "Controlled Component". React is the source of truth for the input. */}
      <input type="text" placeholder="Type here..." value={text} onChange={textInput}/>
    </section>

    <hr />

    {/* SECTION 3: THE CLOCK */}
    <section>
      <h1>Timer: {time}</h1>
    </section>
    </>
  )
}

export default App