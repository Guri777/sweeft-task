import { useQuery, QueryFunction } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";

interface ModalImageProps {
  modal: Record<string, boolean>;
  setModal: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  modalId: string;
  imageId: string;
}

interface ImageData {
  urls: {
    full: string;
  };
  downloads: number;
  views: number;
  likes: number;
}

const Styledmodal = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 98;
`;

const StyledCard = styled.div`
  width: 400px;
  max-width: 90%;
  background-color: white;
  border: 3px solid #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 99;
`;

const StyledWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const CloseButton = styled.button`
  background-color: #333;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const fetchformoddal: QueryFunction<ImageData> = async ({ queryKey }) => {
  const [, imageId] = queryKey;
  const accesskey = "LLC_EmnWF8QVGeJDrVNE1NGbWddVASwEj5vnupH1buo";
  const res = await fetch(`https://api.unsplash.com/photos/${imageId}/?client_id=${accesskey}`);
  return res.json();
};
// console.log(queryKey.imageId)
export const ModalImage: React.FC<ModalImageProps> = ({  setModal, modalId, imageId }) => {
  const handleshowmodal = () => {
    setModal((prev) => ({
      ...prev,
      [modalId]: false,
    }));
  };

  const { data } = useQuery({
    queryKey: ["detail", imageId],
    queryFn: fetchformoddal,
  });

  return (
    <StyledWrapper>
      <Styledmodal onClick={handleshowmodal}>
        <StyledCard>
          <figure>
            <img src={data?.urls.full} width={"100%"} alt="Full Size" />
          </figure>
          <p>Downloads: {data?.downloads}</p>
          <p>Views: {data?.views}</p>
          <p>Likes: {data?.likes}</p>
          <CloseButton onClick={handleshowmodal}>Close Modal</CloseButton>
        </StyledCard>
      </Styledmodal>
    </StyledWrapper>
  );
};
