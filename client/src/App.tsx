import { Route, Switch, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Library from "./pages/Library";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ROUTES } from "@shared/const";

/**
 * Public site routes. Auth, the backoffice portal and the API wiring land on
 * top of this shell later — the pages here are self-contained for now.
 */
function Router() {
  return (
    <Switch>
      <Route path={ROUTES.home} component={Home} />
      <Route path={ROUTES.about} component={About} />
      <Route path={ROUTES.library} component={Library} />
      <Route path={ROUTES.contact} component={Contact} />
      <Route path={ROUTES.login} component={Login} />
      <Route path={ROUTES.dashboard} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Static preview hosts serve one document and cannot rewrite deep links back
 * to it, so a path router 404s on every route but the first. Building with
 * VITE_HASH_ROUTER=true moves routing into the URL fragment, which those hosts
 * never see. Normal builds keep clean paths.
 */
const hashRouting = import.meta.env.VITE_HASH_ROUTER === "true";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WouterRouter
          base={hashRouting ? "" : import.meta.env.BASE_URL.replace(/\/$/, "")}
          hook={hashRouting ? useHashLocation : undefined}
        >
          <Router />
        </WouterRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
