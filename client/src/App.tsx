import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NewsPage from "./pages/NewsPage";
import SummaryPage from "./pages/SummaryPage";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <i className="fas fa-globe me-2"></i>
            News Aggregator
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  <i className="fas fa-newspaper me-1"></i>
                  News
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/summary" className="nav-link">
                  <i className="fas fa-robot me-1"></i>
                  AI Summary
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
