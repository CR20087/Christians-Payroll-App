import { BrowserRouter } from 'react-router-dom';
import Pages from './Components/Pages'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Pages/>
      </BrowserRouter> 
    </div>
  ); 
}

export default App;

