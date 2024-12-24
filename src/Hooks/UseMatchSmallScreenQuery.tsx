import useMatchMediaQuery from "./UseMatchMediaQuery";

export default function useMatchSmallScreenQuery() {

  const isSmallScreen = useMatchMediaQuery("(max-width: 1024px)");
  
  return isSmallScreen;
}