

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import '@mantine/core/styles.css';
import { MantineProvider,Textarea,Title } from '@mantine/core';

//import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <MantineProvider>
      <Title>Vite + React</Title>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

      </div>
      <Textarea autosize/>
      </MantineProvider>
    </>
  )
}

export default App
