import './App.scss';
import "react-toggle/style.css"
import { useEffect, useState } from 'react';
import { useDarkMode } from 'react-recipes';
import { initAppContext } from './helpers/dataHelper';
import { AppContext } from './AppContext';
import { ReactComponent as Logo } from './assets/logo.svg'
import { ReactComponent as SunIcon } from './assets/sun_icon.svg'
import { ReactComponent as MoonIcon } from './assets/moon_icon.svg'
import VerbList from './components/VerbList';
import SettingsList from './components/SettingsList';
import CopyrightInfo from './components/CopyrighInfo';
import Toggle from 'react-toggle';


function App() {
  const [context, setContext] = useState();
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    initAppContext(setContext);
  }, []);

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light'
    document.body.setAttribute('data-theme', theme);
  }, [darkMode]);

  if (!context) return <div>loading...</div>;

  return (
    <AppContext.Provider value={context}>
      <div className="App">

        <header className='AppHeader'>

          <Logo className='AppLogo' />

          <h1 className='AppTitle'>
            Japanese verb conjugation table
          </h1>

          <Toggle checked={darkMode}
            onChange={({ target }) => setDarkMode(target.checked)}
            icons={{ checked: <MoonIcon />, unchecked: <SunIcon />, }} />
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
