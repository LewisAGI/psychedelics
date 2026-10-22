import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DetailPage } from './components/DetailPage';
import { ListPage } from './components/ListPage';
import { OriginsMap } from './components/OriginsMap';
import { ReadingPage } from './components/ReadingPage';
import { Shell } from './components/Shell';
import { TimelinePage } from './components/TimelinePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<ListPage />} />
          <Route path="substance/:id" element={<DetailPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="origins" element={<OriginsMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
