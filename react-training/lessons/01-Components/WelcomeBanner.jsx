// src/lessons/01-Components/WelcomeBanner.jsx

// 1. Define the function. Capital "W".
const WelcomeBanner = () => {
  
  // 2. Logic goes BEFORE the return.
  // In the real world, we might check the time to say "Good Morning".
  const date = new Date();
  const currentHour = date.getHours();
  let greeting = "Hello";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  // 3. The Return. This looks like HTML, but it's JSX (JavaScript XML).
  // Notice the parentheses () allow us to break into multiple lines.
  return (
    <div className="banner-container" style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
      
      {/* We use curly braces {} to inject JavaScript variables into the HTML */}
      <h1>{greeting}, Admin!</h1>
      
      <p>System status: <span style={{ color: 'green' }}>Operational</span></p>
      
      {/* This is a comment in JSX.
         Notice we are returning ONE parent div.
         If we removed the outer <div>, this code would crash.
      */}
    </div>
  );
};

// 4. Export it so 'App.jsx' can use it.
export default WelcomeBanner;