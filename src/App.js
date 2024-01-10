//import './App.css';
import React from 'react';
import Header from './components/Header';
import Guests from './components/Guests';

export default function App() {
  const baseUrl = 'http://localhost:4000';

  return (
    <>
      <div className="App">
        <Header></Header>
        <Guests baseUrl={baseUrl}></Guests>
      </div>
    </>
  );
}
