import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="glass-card p-10 text-center max-w-sm">
      <p className="font-script text-6xl text-primary mb-2">Ops!</p>
      <p className="font-serif-display text-2xl mb-6">Esta página não existe.</p>
      <Link to="/" className="text-xs tracking-[0.25em] uppercase text-primary underline underline-offset-4">
        Voltar ao convite
      </Link>
    </div>
  </div>
);

export default NotFound;
