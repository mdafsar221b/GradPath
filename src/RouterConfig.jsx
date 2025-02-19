import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Semester1 from './Componants/Semester1';
import Semester2 from './Componants/Semester2';
import Semester3 from './Componants/Semester3';
import Semester4 from './Componants/Semester4';
import Semester5 from './Componants/Semester5';
import Semester6 from './Componants/Semester6';
import { semOneSub,semTwoSub,semThreeSub,semFourSub,semFiveSub,semSixSub } from './utils/constants';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'semester1', element: <Semester1 /> },
      { path: 'semester2', element: <Semester2 /> },
      { path: 'semester3', element: <Semester3 /> },
      { path: 'semester4', element: <Semester4 /> },
      { path: 'semester5', element: <Semester5 /> },
      { path: 'semester6', element: <Semester6 /> }
    ]
  }
]);

export default router;
