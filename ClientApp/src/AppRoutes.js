import { Home } from "./components/Home";
import { UploadImage } from "./components/UploadImage";
import ResultWrapper from "./components/Result";
import { History } from "./components/History";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/upload-image',
    element: <UploadImage />
  },
  {
    path: '/result/:id/:isFromUpload',
    element: <ResultWrapper />
  },
  {
    path: '/history',
    element: <History />
  }
];

export default AppRoutes;
