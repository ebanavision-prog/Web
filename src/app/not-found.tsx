export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
      <p className="mb-2 text-6xl font-bold text-red-600">404</p>
      <h1 className="mb-2 text-2xl font-semibold">Página no encontrada</h1>
      <a href="/" className="rounded-full bg-red-600 px-6 py-3 font-medium">
        Volver al inicio
      </a>
    </div>
  );
}
