import { useEffect } from "react";
function useEscapeClose(toggleFunction) {
  useEffect(() => {
    const handleKeyESC = (event) => {
      if (event.key === "Escape") {
        toggleFunction(); 
      }
    };

    window.addEventListener("keydown", handleKeyESC);

    return () => {
      window.removeEventListener("keydown", handleKeyESC);
    };
  }, [toggleFunction]);
}

export default useEscapeClose;
