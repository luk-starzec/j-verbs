import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { initAppContext } from './helpers/dataHelper';
import { AppContext } from './AppContext';
import VerbList from './components/VerbList';
import ColumnSettings from './components/ColumnSettings';
import RowFilter from './components/RowFilter';
import TextFormatSettings from './components/TextFormatSettings';
import SettingsList from './components/SettingsList';

function App() {
  const [context, setContext] = useState();

  useEffect(() => {
    initAppContext(setContext);
    //console.log(context);
  }, []);

  if (!context) return <div>loading...</div>;

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <AppContext.Provider value={context}>
        <VerbList />
        <SettingsList />
      </AppContext.Provider>

    </div>
  );
}

export default App;
