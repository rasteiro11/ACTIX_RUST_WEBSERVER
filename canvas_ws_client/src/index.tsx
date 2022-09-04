import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
  //ws.on('open', () => ws.send("VAI A MERDA"))
  //console.log("WE HERE 2")
  //ws.on('message', (data) => {
  //  console.log(`Received Message: ${data}`)
  //})

root.render(
  <React.StrictMode>
    <App width={300} height={300} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
