// src/components/common/Revista.jsx
import { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFlip } from 'swiper/modules';
import Zoom from 'react-medium-image-zoom';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'react-medium-image-zoom/dist/styles.css';
import './Revista.css';

// Lista de páginas del catálogo/carta
const catalogoFotos = [
  '/images/catalogo/2.jpg',
  '/images/catalogo/3.jpg',
  '/images/catalogo/4.jpg',
  '/images/catalogo/5.jpg',
  '/images/catalogo/6.jpg',
  '/images/catalogo/7.jpg',
  '/images/catalogo/8.jpg',
  '/images/catalogo/9.jpg',
  '/images/catalogo/10.jpg',
  '/images/catalogo/11.jpg',
  '/images/catalogo/12.jpg',
];

const Revista = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [flipbookDimensions] = useState({ width: 680, height: 980 });

  const flipBook = useRef(null);
  const swiperRef = useRef(null);

  // Detectar tamaño de pantalla para cambiar entre Desktop (FlipBook) y Mobile (Swiper Flip)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalPaginas = 1 + catalogoFotos.length;
  const canGoPrev = paginaActual > 0;
  const canGoNext = paginaActual < totalPaginas - 1;

  const handlePrev = () => {
    if (isMobile) {
      swiperRef.current?.slidePrev();
    } else {
      flipBook.current?.pageFlip()?.flipPrev();
    }
  };

  const handleNext = () => {
    if (isMobile) {
      swiperRef.current?.slideNext();
    } else {
      flipBook.current?.pageFlip()?.flipNext();
    }
  };

  return (
    <div className="revista-section">
      <div className="revista-container container-revealed max-w-4xl mx-auto">
        <div className="revista-content-wrapper">
          {isMobile ? (
            /* VISTA MÓVIL CON SWIPER EFFECT FLIP */
            <div className="revista-swiper-wrapper max-w-sm sm:max-w-md mx-auto">
              <Swiper
                modules={[EffectFlip]}
                effect="flip"
                spaceBetween={0}
                slidesPerView={1}
                initialSlide={0}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => setPaginaActual(swiper.activeIndex)}
                className="revista-swiper"
              >
                <SwiperSlide key="portada">
                  <div className="revista-pagina">
                    <Zoom>
                      <img
                        src={`${import.meta.env.BASE_URL}images/catalogo/tapa1.jpg`}
                        alt="Portada"
                        className="revista-img"
                      />
                    </Zoom>
                  </div>
                </SwiperSlide>
                {catalogoFotos.map((src, i) => (
                  <SwiperSlide key={i + 1}>
                    <div className="revista-pagina">
                      <Zoom>
                        <img
                          src={`${import.meta.env.BASE_URL}${src.startsWith('/') ? src.slice(1) : src}`}
                          alt={`Página ${i + 2}`}
                          className="revista-img"
                        />
                      </Zoom>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            /* VISTA ESCRITORIO CON HTMLFlipBook */
            <div className="flipbook-wrapper">
              <HTMLFlipBook
                ref={flipBook}
                width={flipbookDimensions.width}
                height={flipbookDimensions.height}
                size="stretch"
                minWidth={400}
                maxWidth={980}
                minHeight={560}
                maxHeight={980}
                drawShadow={true}
                showCover={true}
                mobileScrollSupport={true}
                className="revista-flipbook"
                startPage={1}
                flippingTime={400}
                usePortrait={true}
                maxShadowOpacity={0.5}
                useMouseEvents={true}
                disableFlipByClick={false}
                onFlip={(e) => setPaginaActual(e.data)}
                autoSize={true}
                swipeDistance={10}
                showPageCorners={false}
                style={{}}
                startZIndex={0}
              >
                {/* Portada */}
                <div className="revista-pagina">
                  <img
                    src={`${import.meta.env.BASE_URL}images/catalogo/tapa1.jpg`}
                    alt="Portada"
                    className="revista-img"
                  />
                </div>
                {/* Páginas internas */}
                {catalogoFotos.map((src, i) => (
                  <div className="revista-pagina" key={i + 1}>
                    <img
                      src={`${import.meta.env.BASE_URL}${src.startsWith('/') ? src.slice(1) : src}`}
                      alt={`Página ${i + 2}`}
                      className="revista-img"
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}

          {/* Botones de Navegación Lateral */}
          <button
            type="button"
            className={`revista-nav-button left ${!canGoPrev ? 'disabled' : ''}`}
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Página anterior"
          >
            ❮
          </button>
          <button
            type="button"
            className={`revista-nav-button right ${!canGoNext ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Página siguiente"
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default Revista;
