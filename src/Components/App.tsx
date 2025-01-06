import { useEffect, useRef } from "react";
import Explorer from "./Explorer";
import Navigator from "./Navigator";
import { preconnect } from "react-dom";
import AppInfoBox from "./AppInfoBox";

export default function App() {

  const ccexContainerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    preconnect(import.meta.env.VITE_BACKEND_ADDR);
  }, []);

  return (
    // Change application size by modifying the main's width and height.
    // Cannot use % units for this.
    <main id="ccex" className="relative h-screen w-screen border border-black
      lg:h-screen lg:w-screen">  
      <div id="ccex-scrollview" ref={ccexContainerRef} className="flex flex-col w-full h-full overflow-auto">
        <Navigator />
        <Explorer containerRef={ccexContainerRef} />
      </div>
    </main>
  )
}
