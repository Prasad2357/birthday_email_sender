

// // import { BrowserRouter } from 'react-router-dom';
// // import Approutes from './routes/Approutes'
// // import './App.css'
// // function App(){
// //   return (
// //     <BrowserRouter>
// //           <Approutes/>
// //     </BrowserRouter>
// //   )

// // }

// // export default App

// import React from 'react';
// import BirthdayList from './components/BirthdayList';
// import Navbar from './components/Navbar';
// import './App.css';

// function App() {
//   return (
//     <div className="app">
//       <Navbar />
//       <main className="main-content">
//         <BirthdayList />
//       </main>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/Approutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;