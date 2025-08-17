import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import ClienteForm from "./components/ClienteForm";
import ClienteList from "./components/ClienteList";
import EntrevistaForm from "./components/EntrevistaForm";
import { useState } from "react";
import LeveyJenningsPage from "./pages/LeveyJenningsPage"; // <--- Nuevo import

function App() {
  const [actualizar, setActualizar] = useState(false);
  const handleClienteCreado = () => setActualizar(!actualizar);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <NavBar />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ClienteForm onClienteCreado={handleClienteCreado} />
                  <ClienteList actualizar={actualizar} />
                </>
              }
            />
            <Route path="/entrevista/:id" element={<EntrevistaForm />} />
            <Route path="/levey-jennings" element={<LeveyJenningsPage />} /> {/* <-- Nueva ruta */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
