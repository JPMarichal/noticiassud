import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NewsPage from "./pages/NewsPage";
import SummaryPage from "./pages/SummaryPage";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Effect to initialize Bootstrap collapse
  useEffect(() => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!navbarCollapse.contains(target) && !navbarToggler.contains(target)) {
          setIsMenuOpen(false);
        }
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand" onClick={closeMenu}>
            <i className="fas fa-globe me-2"></i>
            Noticias de la Iglesia
          </Link>

          <button 
            className="navbar-toggler" 
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div 
            className={`navbar-collapse ${isMenuOpen ? 'show' : 'collapse'}`} 
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-newspaper me-1"></i>
                  Noticias de la Iglesia
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/summary" className="nav-link" onClick={closeMenu}>
                  <i className="fas fa-robot me-1"></i>
                  Resumen de noticias
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/" component={NewsPage} />
        <Route path="/summary" component={SummaryPage} />
        <Route component={NotFound} />
      </Switch>

      <Toaster />
    </QueryClientProvider>
  );
}

export default App;