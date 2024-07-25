"use client";

import { Card } from "@nextui-org/react";
import FileTreePanel from "./Components/Dashboard/FileTreePanel/FileTreePanel";
import ProcessesPanel from "./Components/Dashboard/ProcessesPanel/ProcessesPanel"
import TreeSessionPanel from "./Components/Dashboard/TreeSessionPanel/TreeSessionPanel";
import PreferencesPanel from "./Components/Dashboard/PreferencesPanel/PreferencesPanel";


export default function Home() {

  

  return (

      <div className="grid grid-cols-3 grid-rows-8 gap-6 w-full" style={{height: 'var(--main-height)'}}>
        

      <ProcessesPanel />

      <TreeSessionPanel />

      <FileTreePanel />

      <Card className="dark" style={{gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 5, gridRowEnd: 9}} />

      <Card className="dark" style={{gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 6, gridRowEnd: 9}} />

      <PreferencesPanel />

      


      </div>

  );
}
