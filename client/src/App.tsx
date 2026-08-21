import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Library from "./pages/Library";
import Contact from "./pages/Contact";
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
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </ErrorBoundary>
  );
}

export default App;
