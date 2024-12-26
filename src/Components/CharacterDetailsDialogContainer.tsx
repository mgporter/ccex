import { useEffect } from "react";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import CharacterDetailsDialog, { CharacterDetailsInline } from "./CharacterDetailsDialog";
import DialogModel from "./DialogModal";
import { ChineseCharacterBasicDTO, ComponentStub, DerivativeStub } from "../Api/types";
import { CharacterDetailsContext } from "../Hooks/UseCharacterDetailsContext";
import { useSearchParams } from "react-router-dom";
import { ccexDispatcher } from "../Utils/CCEXDispatcher";
import useMatchSmallScreenQuery from "../Hooks/UseMatchSmallScreenQuery";

interface CharacterDetailsDialogProps {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

type ObjectWithChar = { char: string }

function ensureUniqueChar<T extends ObjectWithChar>(arr: T[]): T[] {
  const map = new Map<string, T>();

  for (const obj of arr) {
    map.set(obj.char, obj);
  }

  return [...map.values()];
}

export default function CharacterDetailsDialogContainer({ isOpenState }: CharacterDetailsDialogProps) {

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ isOpen, setIsOpen ] = isOpenState;
  const fetchDetailsHook = useFetchChineseCharacterDetails(searchParams.get("details"));
  const isSmallScreen = useMatchSmallScreenQuery();

  useEffect(() => {
    const unsubscribe = ccexDispatcher.subscribe("showCharDetails", (char: string | null) => {
      if (char) {
        setIsOpen(true);
        fetchDetailsHook.fetchData(char);
        setSearchParams((prev) => { prev.set("details", char); return prev });
      } else {
        searchParams.delete("details");
        setIsOpen(false);
      }
    });

    return unsubscribe;
  }, [searchParams, setIsOpen, fetchDetailsHook, setSearchParams])

  useEffect(() => {
    if (isSmallScreen) {
      window.scrollTo({top: 0, behavior: "instant"})
    }
  }, [fetchDetailsHook, isSmallScreen])

  useEffect(() => {
    if (searchParams.has("details")) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchParams, setIsOpen])

  const closeAction = () => {
    setIsOpen(false);
    searchParams.delete("details");
    setSearchParams(searchParams);
  }

  const data = fetchDetailsHook.data;

  if (data) {
    data.components = ensureUniqueChar<ComponentStub>(data.components);
    data.variants = ensureUniqueChar<ChineseCharacterBasicDTO>(data.variants);
    data.derivatives = ensureUniqueChar<DerivativeStub>(data.derivatives);
  }

  return (
    <CharacterDetailsContext.Provider value={fetchDetailsHook}>
      {isSmallScreen ? (
        <CharacterDetailsInline isOpen={isOpen} closeAction={closeAction} />
      ) : (
        <DialogModel isOpen={isOpen} closeAction={closeAction}>
          <CharacterDetailsDialog isOpen={isOpen} closeAction={closeAction} />
        </DialogModel>  
      )}
    </CharacterDetailsContext.Provider>
  )

}