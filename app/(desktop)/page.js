import { Window } from "@/components/desktop/Window";
import { Welcome } from "@/components/desktop/Welcome";

export default function Home() {
  return (
    <Window title="Bienvenido">
      <Welcome />
    </Window>
  );
}
