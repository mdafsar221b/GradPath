import { createBrowserRouter,Navigate } from 'react-router-dom';
import App from './App';
import SemesterComponent from './Componants/SemesterComponent';
import { semOneSub, semTwoSub, semThreeSub, semFourSub, semFiveSub, semSixSub } from './utils/constants';

const semesterData = {
  '1': semOneSub,
  '2': semTwoSub,
  '3': semThreeSub,
  '4': semFourSub,
  '5': semFiveSub,
  '6': semSixSub
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // {
      //   index: true, //  default loads
      //   element: <Navigate to="/semester/1" replace />
      // },
      {
        path: 'semester/:semesterNumber',
        element: <SemesterComponent />,
        loader: ({ params }) => {
          const data = semesterData[params.semesterNumber];
          if (!data) {
            throw new Response('Not Found', { status: 404 });
          }
          return data;
        }
      }
    ]
  }
]);


export default router;
