import { useState, useEffect, useRef, useCallback } from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

export default function SearchBar({ onSearch, placeholder = 'Search posts...', initialValue = '' }) {
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedSearch = useCallback(
    (searchVal) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onSearch(searchVal);
      }, 300);
    },
    [onSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative group">
      <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors duration-300" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none text-sm"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
        >
          <RiCloseLine className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
