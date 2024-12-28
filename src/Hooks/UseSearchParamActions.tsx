import { useSearchParams } from "react-router-dom";

export default function useSearchParamActions() {

  const [searchParams, setSearchParams] = useSearchParams();

  function removeSearchParamDetails() {
    searchParams.delete("details");
    setSearchParams(searchParams)
  }

  function setSearchParamDetails(char: string) {
    searchParams.set("details", char);
    setSearchParams(searchParams);
  }

  function setSearchParamTreeMaps(chars: string) {
    searchParams.set("chars", chars);
    searchParams.delete("details");
    setSearchParams(searchParams);
  }

  return {
    getSearchParamTreeMaps: searchParams.get("chars"),
    getSearchParamDetails: searchParams.get("details"),
    searchParamsHasTreeMaps: searchParams.has("chars"),
    searchParamsHasDetails: searchParams.has("details"),
    removeSearchParamDetails,
    setSearchParamDetails,
    setSearchParamTreeMaps
  }

}