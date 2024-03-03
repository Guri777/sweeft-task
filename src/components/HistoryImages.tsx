import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { ModalImage } from "./ModalImage.tsx";

interface HistoryImagesProps {
  slug: string;
}

interface Image {
  id: string;
  urls: {
    small: string | undefined;
    raw: string;
  };
}

interface HistoryImagesData {
  results?: Image[];
}

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const ImageCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

export const HistoryImages: React.FC<HistoryImagesProps> = ({ slug }) => {
  const accesskey = "LLC_EmnWF8QVGeJDrVNE1NGbWddVASwEj5vnupH1buo";
  const [modal, setModal] = useState<{ [key: string]: boolean }>({});

  const handleImageModal = (imageId: string) => {
    setModal((prev) => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

  const fetchHistoryImages = async (): Promise<HistoryImagesData> => {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${slug}&page=1&per_page=20&order_by=popular&client_id=${accesskey}`
    );
    return res.json();
  };

  const { data } = useQuery<HistoryImagesData>({
    queryKey: ["History", slug],
    queryFn: fetchHistoryImages,
  });

  return (
    <ImageContainer>
      {data?.results?.map((image, index) => (
        <React.Fragment key={index}>
          <ImageCard onClick={() => handleImageModal(image.id)}>
            <img src={image.urls.small} alt={`Image ${index}`} />
          </ImageCard>

          {modal[image.id] && (
            <ModalOverlay>
              <ModalContent>
                <ModalImage
                  modal={modal}
                  setModal={setModal}
                  modalId={image.id}
                  imageId={image.id}
                />
              </ModalContent>
            </ModalOverlay>
          )}
        </React.Fragment>
      ))}
    </ImageContainer>
  );
};
