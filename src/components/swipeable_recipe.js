import { useState } from 'react';

const RecipeCard = ({ recipe, onNextCard, onSwipe }) => {
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    setOffsetY(deltaY);
  };

  const handleTouchEnd = () => {
    if (offsetY > 50) {
        setTransitioning(true);
        setOffsetY(window.innerHeight); // Move card off the screen downwards
    } else if (offsetY < -50) {
        setTransitioning(true);
        setOffsetY(-window.innerHeight); // Move card off the screen upwards
    }
  };

  const handleTransitionEnd = () => {
    if (offsetY > 50) {
        onNextCard('down');
    } else if (offsetY < -50) {
        onNextCard('up');
    }
    if (transitioning) {
      setVisible(false);
      setOffsetY(0);
      setVisible(true);
      setTransitioning(false);
    }
  };

  return (
    <div
    className={`recipe-card ${visible ? '' : 'hidden'} ${transitioning ? 'transitioning' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTransitionEnd={handleTransitionEnd}
      style={{
        transform: `translateY(${offsetY}px)`,
        opacity: visible ? 1 : 0,
        transition: transitioning ? 'transform 0.5s, opacity 1s ease-in' : 'none',
      }}
    >
        <div className="arrow-up" onClick={() => onSwipe('up')}>
            &#9650;
        </div>
        <img src={recipe.image} alt={recipe.title} />
        <h2>{recipe.title}</h2>
        <div className="arrow-down" onClick={() => onSwipe('down')}>
            &#9660;
        </div>
    </div>
  );
};

export default RecipeCard;