import { Window } from "@/components/desktop/Window";

// Inicio, Proyectos y Blog consultan Mongo en cada request. Mientras responde,
// el escritorio muestra una ventana con el spinner de macOS en vez de quedarse
// vacío.
export default function Loading() {
  return (
    <Window title="">
      <div className="flex h-full items-center justify-center">
        <div
          aria-label="Loading"
          className="h-6 w-6 animate-spin rounded-full border-2 border-desk-fg/15 border-t-desk-fg/60"
        />
      </div>
    </Window>
  );
}
