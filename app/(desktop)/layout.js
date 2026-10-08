import { calcularCDMXTime } from "@/libs/cdmxTime";
import CDMXTimeProvider from "@/components/common/CDMXTimeProvider";
import Desktop from "@/components/desktop/Desktop";

// La hora de CDMX decide el tema (día/noche) desde el primer HTML, así que
// cada request se renderiza al momento.
export const dynamic = "force-dynamic";

// El escritorio (wallpaper, barra de menú, íconos) vive en este layout y no se
// vuelve a montar al navegar entre /, /about, /projects y /contact: solo cambia
// la ventana que trae cada página.
export default function DesktopLayout({ children }) {
  return (
    <CDMXTimeProvider initial={calcularCDMXTime()}>
      <Desktop>{children}</Desktop>
    </CDMXTimeProvider>
  );
}
