import { useState } from "react"
import DialogModel from "./DialogModal";
import useMatchSmallScreenQuery from "../Hooks/UseMatchSmallScreenQuery";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";
import DynamicScrollDiv from "./DynamicScrollDiv";
import { Button } from "@headlessui/react";


export default function AppInfoBox() {
  const [showNotes, setShowNotes] = useState(false);
  const isSmallScreen = useMatchSmallScreenQuery();
  const { appContainer } = useCCEXStore();

  return (
    <div className={"flex items-center gap-2 font-sans text-lg text-black/50 font-bold mb-1 mr-1 " +
      (isSmallScreen ? "w-full justify-center " : "self-end ")}>

      <a className="block cursor-pointer hover:bg-black/80 hover:text-white transition-colors px-2 py-1 rounded-lg" onClick={() => setShowNotes(true)}>author's notes</a>
      <div>|</div>
      <a href={import.meta.env.VITE_FE_REPO_ADDR} 
        target="_blank"
        className="group flex items-center gap-2 hover:bg-black/80 hover:text-white transition-colors px-2 py-1 rounded-lg">
          created by mgporter
        <img src="github-logo.png" className="inline size-[1.6rem] opacity-50 group-hover:opacity-100 group-hover:invert transition-all" />
      </a>

      {showNotes && (
        <DialogModel isOpen={showNotes} closeAction={() => setShowNotes(false)} container={appContainer.current}
          className="w-full" >
          {<AuthorsNotes closeAction={() => setShowNotes(false)} />}
        </DialogModel>
      )}

    </div>
  )
}


function AuthorsNotes({ closeAction }: { closeAction: () => void}) {

  const { appContainer } = useCCEXStore();

  return (
    <div className="flex flex-col p-8 pr-4
      lg:p-4">
      <DynamicScrollDiv 
        className="flex flex-col gap-2 overflow-y-auto pr-4 overscroll-none" 
        container={appContainer.current} 
        maxHeightPercent={70}
      >
        <div className="flex justify-center gap-4 items-center mb-8 mt-4">
          <img src="ccex-favicon-lg.jpg" className="size-24 rounded-md border border-slate-400" />
          <div>
            <h1 className="text-center text-xl font-bold">The Chinese Character</h1>
            <h1 className="text-center text-4xl font-bold">Explorer</h1>
          </div>
        </div>
        <h5 className="text-xl font-bold">Introduction</h5>
        <p>The Chinese Character Explorer, or CCEX, contains descriptions, components, and derivatives for over 6,000 Chinese characters. In my learning of Chinese, I was fascinated with how most characters are built from other characters. If you know enough of these 'components', then it gives you a sort of alphabet to use in learning new characters.</p>
        <p>These components, of course, include the so-called 'radicals'. Many radicals do indeed appear frequently, such as 氵 for water, which is found in the characters 河 (river), 湖 (lake), and 海 (ocean), as well as many many others. However, there are also many components that are not commonly accepted radicals. For example, 青 (teal, pronounced "qing") is not a radical, however it is found in 请 (to invite), 清 (clear), and 晴 (clear day). In this case, the component 青 (teal) gives its pronunciation, rather than its meaning, to these derived characters, which are also pronounced "qing". This fact can be extremely useful in guessing the pronunciation of a character one does not know.</p>
        <p>There are many more examples of components giving either their meaning or their pronunciation to derivative characters. This simple program lays out the structure of characters into a tree, showing the relationships between different characters and therefore some of the patterns that underpin the Chinese writing system. I intend this to be helpful for learners of Chinese, as well as those simply interested in the characters themselves.</p>
        <h5 className="text-xl font-bold mt-4">An important note</h5>
        <p>Chinese characters have gone through thousands of years of evolution, so that many components of characters were actually once something else. For example, 能 (able to) was originally a pictograph representing a bear. You can still kind of see it if you think of the right side as sharp claws sticking out. In the modern character, this character is made of the components 厶 (no meaning), 月 (month or meat), and 匕 (knife). Needless to say, these components are not related to the original character in any way. Be weary of finding meaning where there isn't any; sometimes components were chosen simply because they resemble how a character was originally written, as is the case here. Later, this particular character was given a separate character for the bear meaning: 熊, and 能 now exists independently as a word meaning "can" or "able to". See, Chinese *can* be fun ;)</p>
        <p>Anyways, the point is that the components for any given character here are based on the way it is written in MODERN simplified Chinese. For this reason, keep in mind that some components contribute nothing to the character as a whole: they simply exist in the modern character because they look like something else that historically made up that character. The main reason this program is set up this way is that its purpose is to aid Chinese learners in identifying and writing characters as they are written now, rather than to teach people about the etymology of the characters. An additional reason is that I would like to include this information, but it's a lot of work to do for every character.</p>
        <h5 className="text-xl font-bold mt-4">Some technical details</h5>
        <p>CCEX is built in React as a frontend, which communicates through a REST api to a backend .NET application running on an AWS instance. That in turn is backed by a PostgreSQL database running in an AWS RDS instance.</p>
        <p>Enjoy!</p>
      </DynamicScrollDiv>
      <Button 
        onClick={closeAction}
        className="border border-slate-500 mt-4 py-1 px-8 rounded-md self-center w-1/2 hover:bg-gray-200
          active:bg-gray-600 active:text-white">
        Close
      </Button>
    </div>
  )
}