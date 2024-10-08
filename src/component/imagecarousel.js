// src/component/imagecarousel.js
import React from 'react';
import { MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';
import '../css/imagecarousel.css'; // Assurez-vous que le chemin est correct

function ImageCarousel() {
  return (
    <div className="imagecarousel-container">
      <MDBCarousel showControls showIndicators>
        <MDBCarouselItem itemId={1}>
        <img   className="imagecarou"  src='/img/image de carosel/8.webp' alt='...' />
        </MDBCarouselItem>
        <MDBCarouselItem itemId={2}>
          <img  className="imagecarou"  src='/img/image de carosel/13.jpeg' alt='...' />
        </MDBCarouselItem>
        <MDBCarouselItem itemId={3}>
          <img   className="imagecarou"  src='/img/image de carosel/7.jpg' alt='...' />
        </MDBCarouselItem>
      </MDBCarousel>
    </div>
  );
}

export default ImageCarousel;
