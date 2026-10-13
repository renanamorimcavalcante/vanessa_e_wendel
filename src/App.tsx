import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

/**
 * Só o convite (/) vai no pacote inicial. Galeria e painel administrativo
 * são carregados sob demanda — o convidado não baixa esse código.
 */
const GaleriaStage = lazy(() => import("@/components/GaleriaStage"));
const CPanelPage = lazy(() => import("./pages/CPanelPage"));
const GuestListPage = lazy(() => import("./pages/GuestListPage"));
const EditGuestPage = lazy(() => import("./pages/EditGuestPage"));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/galeria" element={<GaleriaStage />} />
        <Route path="/cpanel" element={<CPanelPage />} />
        <Route path="/listadeconvidados" element={<GuestListPage />} />
        <Route path="/edit-guest/:id" element={<EditGuestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
