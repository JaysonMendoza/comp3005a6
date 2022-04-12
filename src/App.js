import './App.css';
// import MonsterView from './Views/MonsterView';
import {BrowserRouter} from 'react-router-dom'
import {Container} from 'react-bootstrap';
import MainView from './Views/MainView';

function App() {
  return (
      <BrowserRouter>
        <MainView/>
      </BrowserRouter>
  );
}

export default App;
