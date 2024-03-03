import './App.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from "styled-components";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from './MainPage.tsx';
import { History } from './History.tsx';


function App() {
  
  
 
  


  return (
   <BrowserRouter>
      <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route  path='/history' element={<History/>}/>
      </Routes>
   </BrowserRouter>
  );
}

export default App;
