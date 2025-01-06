import { useState } from "react"
import DialogModel from "./DialogModal";
import useMatchSmallScreenQuery from "../Hooks/UseMatchSmallScreenQuery";


export default function AppInfoBox() {
  const [showNotes, setShowNotes] = useState(false);
  const isSmallScreen = useMatchSmallScreenQuery();

  return (
    <div className={"flex items-center gap-2 font-sans text-lg text-black/50 font-bold mb-1 mr-1 " +
      (isSmallScreen ? "w-full justify-center "
      : "self-end")}>

      <a className="block cursor-pointer hover:bg-black/80 hover:text-white transition-colors px-2 py-1 rounded-lg" onClick={() => setShowNotes(true)}>author's notes</a>
      <div>|</div>
      <a href={import.meta.env.VITE_FE_REPO_ADDR} 
        target="_blank"
        className="group flex items-center gap-2 hover:bg-black/80 hover:text-white transition-colors px-2 py-1 rounded-lg">
          created by mgporter
        <img src="github-logo.png" className="inline size-[1.6rem] opacity-50 group-hover:opacity-100 group-hover:invert transition-all" />
      </a>

      {showNotes && (
        <DialogModel isOpen={showNotes} closeAction={() => setShowNotes(false)}>
          {AuthorsNotes()}
        </DialogModel>
      )}

    </div>
  )
}


function AuthorsNotes() {
  return (
    <div className="flex flex-col gap-2 p-8">
      <h5 className="text-xl font-bold">Introduction</h5>
      <p>The Chinese Character Explorer, or CCEX, contains descriptions, components, and derivatives for over 6,000 Chinese characters. In my learning of Chinese, I was fascinated with how most characters are built from other characters. If you know enough of these 'components', then it gives you a sort of alphabet to use in learning new characters.</p>
      <p>These components, of course, are often called radicals. Many of the radicals do indeed appear quite frequently, such as 氵 for water, which is found in the characters 河 (river), 湖 (lake), and 海 (ocean), as well as many amny others. However, there are also many components that are not commonly accepted radicals. For example, 青 (teal) is not a radical, however it is found in 请 (to invite), 清 (clear), and 晴 (clear day). In this case, the component 青 (teal) gives its pronunciation, rather than its meaning, to its derivative characters. In this case, 青, 请, 清 and 晴 are all pronounced "qing".</p>
      <p>There are many examples of components giving either their meaning or their pronunciation to derivative characters, and that is way I created the Chinese Character Explorer. This simple program lays out the structure of characters into a tree, showing the relatinoships between different characters. I intend this to be helpful for learners of Chinese, as well as those just interested in the characters themselves.</p>
      <h5 className="text-xl font-bold mt-4">An important note</h5>
      <p>Chinese characters have gone through thousands of years of evolution, so that many components of characters were actually once something else. For example, 能 (able to) was originally a pictograph representing a bear. You can still kind of see it if you think of the right side as sharp claws sticking out. In the modern character, however, the components of this character (厶, 月, and 匕) have nothing to do with bears or bear parts, they just resemble how the old character was written. Later, this character was given a separate character for the bear meaning: 熊, and 能 now exists independently as a word meaning "can" or "able to". See, Chinese *can* be fun ;)</p>
      <p>Anyways, the point is that the components given for a certain character are based on the way it is written in MODERN simplified Chinese. For this reason, keep in mind that some components contribute nothing to the character as a whole: they simply exist in the modern character because they look like something else that historically made up that character. The main reason for this is that the purpose of the program is to aid in people learning the read the language, rather than teach them the etymology of the characters. An additional reason is that I would like to include this information, but it's a lot of work to do for every character.</p>
      <h5 className="text-xl font-bold mt-4">Some technical details</h5>
      <p>CCEX is built in React as a frontend, which communicates through a REST api to a backend .NET application running on an AWS instance. That in turn is backed by a PostgreSQL database running in an AWS RDS instance.</p>
      <p>Enjoy!</p>
    </div>
  )
}