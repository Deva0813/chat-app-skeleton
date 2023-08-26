import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import ChatDiv from "./components/ChatDiv/ChatDiv";
function App() {

  return (
    <BrowserRouter  >
      <div className="App">        
        <Routes>
          <Route path="/" element={ <Home /> }  />
          <Route path="/chat/:name" element={ <ChatDiv/> }  />
        </Routes>
      </div>  
    </BrowserRouter>
  );
}

export default App;
