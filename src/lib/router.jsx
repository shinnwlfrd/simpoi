import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

function getPathname() {
  const hash = window.location.hash;
  if (!hash) return "/dashboard";

  let path = hash.startsWith("#") ? hash.slice(1) : hash;

  // Strip query parameters for routing path matching
  const questionMarkIndex = path.indexOf("?");
  if (questionMarkIndex !== -1) {
    path = path.slice(0, questionMarkIndex);
  }

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return path || "/dashboard";
}

function getPathnameFromHref(href) {
  let path = href;

  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      path = new URL(href).pathname;
    } catch {
      // fallback
    }
  }

  if (path.startsWith("#")) {
    path = path.slice(1);
  }

  // Strip query parameters
  const questionMarkIndex = path.indexOf("?");
  if (questionMarkIndex !== -1) {
    path = path.slice(0, questionMarkIndex);
  }

  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  return path;
}

export function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const handleHashChange = () => setPathname(getPathname());

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      navigate(href) {
        const nextPathname = getPathnameFromHref(href);
        const targetHash = href.startsWith("#") ? href : `#${href}`;

        if (window.location.hash === targetHash) {
          window.scrollTo({ top: 0 });
          return;
        }

        window.location.hash = targetHash;
        setPathname(nextPathname);
        window.scrollTo({ top: 0 });
      },
      pathname,
      prefetch() {
        // React SPA pages are bundled together, so route prefetch is intentionally a no-op.
      },
    }),
    [pathname],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useAppRouter() {
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error("useAppRouter must be used inside RouterProvider.");
  }

  return router;
}

export function usePathname() {
  return useAppRouter().pathname;
}

export function AppLink({ children, className, href, onFocus, onMouseEnter }) {
  const router = useAppRouter();

  function handleClick(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    router.navigate(href);
  }

  const displayHref = href.startsWith("#") ? href : `#${href}`;

  return (
    <a className={className} href={displayHref} onClick={handleClick} onFocus={onFocus} onMouseEnter={onMouseEnter}>
      {children}
    </a>
  );
}
