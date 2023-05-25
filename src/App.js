import './App.css';
import { useEffect, useState } from 'react';
import { initAppContext } from './helpers/dataHelper';
import { AppContext } from './AppContext';
import VerbList from './components/VerbList';
import SettingsList from './components/SettingsList';
import CopyrightLabel from './components/CopyrighLabel';

function App() {
  const [context, setContext] = useState();

  useEffect(() => {
    initAppContext(setContext);
  }, []);

  if (!context) return <div>loading...</div>;

  return (
    <AppContext.Provider value={context}>
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
        <main className='AppContent'>
          <VerbList />
          <SettingsList />
        </main>

        <footer className='AppFooter'>
          <CopyrightLabel />
        </footer>

      </div>
    </AppContext.Provider>
  );
}

export default App;
