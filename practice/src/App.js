import './App.css';
import Header from "./components/Header.jsx";
import Title from "./components/Title.jsx";
import Content from "./components/Content.jsx";
import React, {useState} from "react";

function App() {
  const T = React.createElement('div', null, `Hello!!`)
  return (
    <div className="App">
      <Header>
        <Title color='tomato'>
          <Content></Content>
        </Title>
        {Title({children: Content(), color: 'tomato'})}
      </Header>
      {T}
    </div>
  );
}

export default App;
