import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LoadingScreen from "./scripts/LoadingScreen";
const Dashboard = lazy(() => import("./pages/Dashboard"));

const RouteWithLoader = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 600);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      {children}
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <div className="app">
            <RouteWithLoader>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </RouteWithLoader>
          </div>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
