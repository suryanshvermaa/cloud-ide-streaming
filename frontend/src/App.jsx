import {BrowserRouter,Routes,Route} from "react-router-dom";
import CreateEnvironment from './components/CreateEnvironment';
import EnvironmentProcess from './components/EnvironmentProcess';

function App() {

  return (
    <>
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<CreateEnvironment/>}/>
            <Route path='/processing' element={<EnvironmentProcess/>}/>
        </Routes>
     </BrowserRouter>

    </>
  )
}

export default App
