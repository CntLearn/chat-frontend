import { Route, Switch } from "react-router-dom";
import { Chats, Home } from "./Pages";
import "./App.css";
// <Route path="/" component={Home} exact />
// <Route path="/chats" component={Chats} />
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/chats">
          <Chats />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
