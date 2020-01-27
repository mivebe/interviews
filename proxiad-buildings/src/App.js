import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import "./styles/globalStyles.css"
import Home from "./pages/Home"
import Buildings from "./pages/Buildings";
import Footer from "./components/Footer";
import Header from "./components/Header";



function App() {
  return (
    <>
      <Router>
        <Switch>

          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/buildings">
            <Header />
            <Buildings />
          </Route>

        </Switch>

        <Footer />
      </Router>
    </>
  );
}

export default App;
