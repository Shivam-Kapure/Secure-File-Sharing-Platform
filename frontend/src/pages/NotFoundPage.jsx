import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="screen-center">
      <section className="share-card reveal">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The link you opened does not exist in this frontend.</p>
        <Link className="btn btn-primary" to="/">
          Return home
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
