import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

import { SearchContext } from "@/context/SearchContext";
import { useDebounce } from "./helpers/useDebounce";

import { usePathname } from "next/navigation";

const Searchbar = () => {
  const router = useRouter();
  const [entry, setEntry] = useState("");
  const { setSearchQuery } = useContext(SearchContext);

  const pathname = usePathname();

  // Clear search on route change
  useEffect(() => {
    setEntry(""); // reset search
  }, [pathname]);

  const submitSearch = () => {
    if (!entry.trim()) return;
    router.push(`/search?q=${encodeURIComponent(entry)}`);
  };

  const debouncedQuery = useDebounce(entry, 450);

  useEffect(() => {
    setSearchQuery(debouncedQuery || ""); // send empty string if deleted
  }, [debouncedQuery, setSearchQuery]);

  return (
    <input
      type="search"
      placeholder="Search"
      value={entry} // <-- use local state
      onChange={(e) => setEntry(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") submitSearch();
      }}
    />
  );
};

export default Searchbar;
