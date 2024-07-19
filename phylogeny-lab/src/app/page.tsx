"use client";

import FileTreePanel from "./Components/Dashboard/FileTreePanel/FileTreePanel";
import ProcessesPanel from "./Components/Dashboard/ProcessesPanel/ProcessesPanel"


export default function Home() {

  

  return (
    <main className="flex justify-between top-0 w-full">

      <div className="grid grid-cols-3 gap-6 justify-center w-full">
        

      <ProcessesPanel />

      <FileTreePanel />
      <div className="w-full"></div>
        
      </div>

      

    </main>
  );
}
