import { RefObject, useEffect } from "react";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import CharacterDetailsDialog, { CharacterDetailsInline } from "./CharacterDetailsDialog";
import DialogModel from "./DialogModal";
import { ChineseCharacterBasicDTO, ComponentStub, DerivativeStub } from "../Api/types";
import { CharacterDetailsContext } from "../Hooks/UseCharacterDetailsContext";
import { ccexDispatcher } from "../Utils/CCEXDispatcher";
import useMatchSmallScreenQuery from "../Hooks/UseMatchSmallScreenQuery";
import useSearchParamActions from "../Hooks/UseSearchParamActions";

interface CharacterDetailsDialogProps {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  parentRef: RefObject<HTMLElement>;
}

type ObjectWithChar = { char: string }

function ensureUniqueChar<T extends ObjectWithChar>(arr: T[]): T[] {
  const map = new Map<string, T>();

  for (const obj of arr) {
    map.set(obj.char, obj);
  }

  return [...map.values()];
}

export default function CharacterDetailsDialogContainer({ isOpenState, parentRef }: CharacterDetailsDialogProps) {

  const { setSearchParamDetails, removeSearchParamDetails, getSearchParamDetails, searchParamsHasDetails } = useSearchParamActions();
  const [ isOpen, setIsOpen ] = isOpenState;
  const fetchDetailsHook = useFetchChineseCharacterDetails(getSearchParamDetails);
  const isSmallScreen = useMatchSmallScreenQuery();

  useEffect(() => {
    const unsubscribe = ccexDispatcher.subscribe("showCharDetails", (char: string | null | undefined) => {
      if (char) {
        setSearchParamDetails(char);

        if (isSmallScreen) {
          parentRef.current.scroll({top: 0, behavior: "instant"});
        }

      } else {
        removeSearchParamDetails();
      }
    });

    return unsubscribe;
  }, [isSmallScreen, removeSearchParamDetails, setSearchParamDetails, parentRef])

  useEffect(() => {
    if (searchParamsHasDetails) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchParamsHasDetails, setIsOpen])

  const closeAction = () => {
    setIsOpen(false);
    removeSearchParamDetails();
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
        <DialogModel isOpen={isOpen} closeAction={closeAction} parent={parentRef?.current} >
          <CharacterDetailsDialog isOpen={isOpen} closeAction={closeAction} />
        </DialogModel>  
      )}
    </CharacterDetailsContext.Provider>
  )

}