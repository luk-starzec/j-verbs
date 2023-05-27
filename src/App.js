import './App.css';
import { useEffect, useState } from 'react';
import { initAppContext } from './helpers/dataHelper';
import { AppContext } from './AppContext';
import VerbList from './components/VerbList';
import SettingsList from './components/SettingsList';
import CopyrightInfo from './components/CopyrighInfo';

function App() {
  const [context, setContext] = useState();

  useEffect(() => {
    initAppContext(setContext);
  }, []);

  if (!context) return <div>loading...</div>;

  return (
    <AppContext.Provider value={context}>
      <div className="App">

        <header className='AppHeader'>
          <img src="logo192.png" className='AppLogo' alt='logo' />
          <h1 className='AppTitle'>
            Japanese verb conjugation table
          </h1>
        </header>

        <main className='AppContent'>
          <VerbList />
          <SettingsList />
        </main>

        <footer className='AppFooter'>
          <CopyrightInfo />
        </footer>

      </div>
    </AppContext.Provider>
  );
}

export default App;
