import { useEffect } from "react";
import Explorer from "./Explorer";
import Navigator from "./Navigator";
import { preconnect } from "react-dom";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";

export default function App() {

  const { appContainer } = useCCEXStore();

  useEffect(() => {
    preconnect(import.meta.env.VITE_BACKEND_ADDR);
  }, []);

  return (
    // Change application size by modifying the main's width and height.
    // Cannot use % units for this.
    <main id="ccex" className="relative h-screen w-screen border border-black
      lg:h-screen lg:w-screen">  
      <div id="ccex-scrollview" ref={appContainer} className="flex flex-col w-full h-full overflow-auto">
        <Navigator />
        <Explorer />
      </div>
    </main>
  )
}
