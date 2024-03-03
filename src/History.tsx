import React, { useState } from "react";
import { HistoryImages } from "./components/HistoryImages.tsx";
import styled from "styled-components";

interface HistoryProps {}

interface DisplayState {
  [key: string]: boolean;
}

const HistoryContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const HistoryList = styled.ul`
width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HistoryItem = styled.div`
  margin-bottom: 10px;
`;

const HistoryTitle = styled.li`
  cursor: pointer;
  font-size: 24px;
  text-transform: capitalize;
  font-weight: bold;
  color: #333;
  margin:0 50px;


  &:hover {
    text-decoration: underline;
  }
`;

export const History: React.FC<HistoryProps> = () => {
  const [displayimages, setDisplayimages] = useState<DisplayState>({});

  const handleSuratebiClick = (opa: string) => {
    setDisplayimages((prev) => ({
      ...prev,
      [opa]: !prev[opa],
    }));
  };
  if(!localStorage.getItem("searched"))return
  const arr: string[] = JSON.parse(localStorage.getItem("searched")||"" ) || [];

  return (
    <HistoryContainer>
      <nav style={{width:"100%",display:"flex",justifyContent:"center",marginTop:"30px"}}>
        <HistoryList>
          {arr.length && arr && arr?.map((ele, index) => (
            <HistoryItem key={index + ele}>
              <HistoryTitle onClick={() => handleSuratebiClick(ele)}>
                {ele}
              </HistoryTitle>
              {displayimages[ele] && <HistoryImages slug={ele} />}
            </HistoryItem>
          ))}
        </HistoryList>
      </nav>
    </HistoryContainer>
  );
};
