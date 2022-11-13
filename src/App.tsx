import Header from './component/Header';
import SearchAndResults from "./component/SearchAndResults"
import { useState } from 'react'
import './App.css';

function App() {

  const [alternativeStyle, setAlternativeStyle] = useState<boolean>(false)

  return (
    <div className="App">
      <Header alternativeStyle={alternativeStyle} setAlternativeStyle={setAlternativeStyle} />
      <SearchAndResults alternativeStyle={alternativeStyle} />
    </div>
  );
}

export default App;
