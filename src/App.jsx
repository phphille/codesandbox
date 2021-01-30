import Form from './Form';
import { FormSettings } from './FormSettings';

import './App.scss';

function App() {
  return (
    <div className="app">
      <div className="wrapper">
        <FormSettings>
          <Form />
        </FormSettings>
      </div>
    </div>
  );
}

export default App;
