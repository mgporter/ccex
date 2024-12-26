import { useEffect } from "react";
import Explorer from "./Explorer";
import Navigator from "./Navigator";
import { preconnect } from "react-dom";

export default function App() {

  useEffect(() => {
    preconnect(import.meta.env.VITE_BACKEND_ADDR);
  }, []);

  return (
    <main className="relative">
      <Navigator />
      <Explorer />
    </main>
  )
}
