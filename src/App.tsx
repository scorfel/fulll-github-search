import Header from './component/Header';
import SearchAndResults from "./component/SearchAndResults"
import { useState } from 'react'
import './App.css';

function App() {

  const [alternatriveStyle, setAlternatriveStyle] = useState<boolean>(false)

  return (
    <div className="App">
      <Header alternatriveStyle={alternatriveStyle} setAlternatriveStyle={setAlternatriveStyle} />
      <SearchAndResults alternatriveStyle={alternatriveStyle} />
    </div>
  );
}

export default App;
