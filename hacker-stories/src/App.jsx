import * as React from 'react';

const list = [
  {
  title: "Game 1",
  genre: "RPG",
  description: "Game 1 description",
  objectID: 1
  },
  {
  title: "Game 2",
  genre: "Adventure",
  description: "Game 2 description",
  objectID: 2
  },
];

const List = () => {
  return (
    <>
      <div>
        <ul>
          {list.map(function (game) {
            return (
              <li key={game.objectID}>
                <span>{game.title}</span><br />
                <span>{game.genre}</span><br />
                <span>{game.description}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

const Search = () => {
  return (
    <>
      <label htmlFor="search">Search: </label>
      <input type="text" id="search" />
    </>
  )
};

class Person {
  constructor( firstName, lastName, age, interest) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.interest = interest;
  }
  get Name() {
    return this.firstName + ' ' + this.lastName;
  }
  get PersonalInfo() {
    return 'Their age and interest is ' + this.age + ', ' + this.interest;
  }
}

const Bill = new Person('Bill', 'Witna', 43, 'Cooking');
function App() {
  return (
    <>
      <div>
        <Search/>
        <hr />
        <List/>  
        <hr />
        <p>{Bill.Name}</p>
        <p>{Bill.PersonalInfo}</p>
      </div>
    </>
  )
}



export default App;
