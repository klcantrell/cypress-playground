import { Route, Switch } from 'react-router-dom';
import './App.css';
import CharacterMovies from '../pages/CharacterMovies';
import Characters from '../pages/Characters';

function App(): React.ReactElement {
  return (
    <main>
      <h1>TDD Cypress Demo</h1>
      <Switch>
        <Route path='/' exact component={Characters} />
        <Route path='/characters/:name/movies' component={CharacterMovies} />
      </Switch>
    </main>
  );
}

export default App;
