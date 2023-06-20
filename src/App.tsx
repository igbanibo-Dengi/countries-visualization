import React, { useState, useEffect } from 'react';
import './App.css';

interface Country {
  name: string;
  region: string;
  area: number;
}

const ITEMS_PER_PAGE = 10; // Number of items to display per page

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v2/all?fields=name,region,area'
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  const [filterByArea, setFilterByArea] = useState<boolean>(false);
  const [filterByRegion, setFilterByRegion] = useState<boolean>(false);

  const lithuaniaArea = 65300; // Hardcoded area size of Lithuania

  // Pagination logic
  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentCountries = countries.slice().sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name);
    } else {
      return 0; // No sorting applied
    }
  });

  const totalPages = Math.ceil(countries.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop(); // Scroll to top when page is changed
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    scrollToTop(); // Scroll to top when next page is clicked
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    scrollToTop(); // Scroll to top when previous page is clicked
  };

  const sortedCountries = currentCountries
    .filter((country) => {
      if (filterByArea) {
        return country.area < lithuaniaArea;
      }
      return true;
    })
    .filter((country) => {
      if (filterByRegion) {
        return country.region === 'Oceania';
      }
      return true;
    })
    .slice(firstIndex, lastIndex);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='max-w-[1200px] mx-auto py-10'>
      <h1 className='px-8 py-6 font-bold text-lg'>List of Countries</h1>
      <div className='px-6 py-6'>
        <button
          className='px-4 py-2 bg-green hover:bg-btnhover hover:scale-105 transition-all ease-in-out duration-300 text-white font-semibold rounded-full'
          onClick={handleSort}
        >
          Sort by Name
        </button>
      </div>
      <div className='px-6 flex flex-col md:flex-row'>
        <label className='font-semibold px-3'>
          <input
            className='mr-2'
            type='checkbox'
            checked={filterByArea}
            onChange={() => setFilterByArea(!filterByArea)}
          />
          Filter by Area (Smaller than Lithuania)
        </label>
        <label className='font-semibold px-3'>
          <input
            className='mr-2'
            type='checkbox'
            checked={filterByRegion}
            onChange={() => setFilterByRegion(!filterByRegion)}
          />
          Filter by Region (Oceania)
        </label>
      </div>
      <ul className='p-6'>
        {sortedCountries.map((country, index) => (
          <li key={index} className='my-4 bg-lightGreen p-4 rounded'>
            <h3 className='font-bold text-lg'>{country.name}</h3>
            <p>Region: {country.region}</p>
            <p>Area: {country.area} sq km</p>
          </li>
        ))}
      </ul>
      {/* Pagination */}
      <div className='flex flex-row items-center justify-between px-4'>
        <div className='pagination flex flex-row flex-wrap items-center'>
          <button
            className='w-[100px] h-[30px] bg-green hover:bg-btnhover hover:scale-105 transition-all ease-in-out duration-300 text-white font-semibold rounded-full'
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <div key={index}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={
                  currentPage === index + 1
                    ? 'current-page p-3 font-bold underline'
                    : 'p-3 text-black'
                }
              >
                {index + 1}
              </button>
            </div>
          ))}
          <button
            className='w-[100px] h-[30px] bg-green hover:bg-btnhover hover:scale-105 transition-all ease-in-out duration-300 text-white md:font-semibold rounded-full'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
