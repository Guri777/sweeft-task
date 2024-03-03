import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Usedebounce } from './hooks/Usedebounce';


interface Image {
  urls: {
    small: string;
  };
}

interface Page {
  results?: Image[];
}

interface SearchResponse {
  results?: Page[];
  pages: Page[];
}

interface MainPageProps {}

const StyleInput = styled.div`
  width: 100%;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
  label {
    font-size: 1.5em;
    margin-bottom: 10px;
  }

  input {
    padding: 15px;
    font-size: 1.2em;
    border: 2px solid #3498db;
    border-radius: 8px;
    width: 250px;
    max-width: 100%;
    outline: none;
    transition: border-color 0.3s ease;
  }

  input:focus {
    border-color: #2ecc71;
  }
`

const Wrapperdiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
  flex-wrap: wrap;
  gap: 20px;

  .images {
    width: 350px;
    height: 280px;
    border-radius: 8px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
    cursor: pointer;
  }

  .images:hover {
    transform: scale(1.05);
  }

  .loading {
    font-size: 1.2em;
    margin-top: 20px;
  }
`;

export const MainPage: React.FC<MainPageProps> = () => {
  const [result, setResult] = useState('');
  const SearchDebounced = Usedebounce(result, 1000);
  //@ts-ignore
  const [history,setHistory]= useState<any>(JSON.parse(localStorage.getItem("searched"))||[])

  const accesskey = 'LLC_EmnWF8QVGeJDrVNE1NGbWddVASwEj5vnupH1buo';

 const fetchImages = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `https://api.unsplash.com/${SearchDebounced ? 'search/' : ''}photos/?query=${SearchDebounced}&page=${pageParam}&client_id=${accesskey}&per_page=20`
    );
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<SearchResponse>({
    queryKey: ['images', SearchDebounced],
    // @ts-ignore
    queryFn:fetchImages,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam:any) => {
      if (lastPage.results?.length === 0 && lastPage.pages.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
   
    enabled: true,
  });

  const handleinput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(e.target.value);
  };

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (SearchDebounced.trim().length > 0) {
      if(history.includes(SearchDebounced))return
      setHistory((prev: any) => [...prev, SearchDebounced]);
      localStorage.setItem("searched", JSON.stringify([...history, SearchDebounced]));
    }
  }, [SearchDebounced]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (error) {
    return <div>error...</div>;
  }
  //@ts-ignore
  const rendata = data?.results ? data?.results.pages[0] : data?.pages;

  return (
    <>
    <StyleInput>
    <label id="search">search images</label>
      <input
        id="search"
        type="search"
        placeholder="search"
        onChange={handleinput}
        value={result}
      />
      <a href="/history">History</a>
      </StyleInput>
    <Wrapperdiv>
      {rendata &&
        rendata.map((ele: { results: any; }) => {
          const test = ele.results ? ele.results : ele;
          return test?.map((ele: { urls: { small: any; }; }) => (
            <img src={ele.urls.small} className="images" key={ele.urls.small} />
          ));
        })}
      {isFetching && <div className="loading">Loading...</div>}
    </Wrapperdiv>
    </>
  );
};
