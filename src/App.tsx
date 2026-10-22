import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ComparePage } from './components/ComparePage';
import { DetailPage } from './components/DetailPage';
import { GlossaryPage } from './components/GlossaryPage';
import { InteractionsPage } from './components/InteractionsPage';
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
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="interactions" element={<InteractionsPage />} />
          <Route path="compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
