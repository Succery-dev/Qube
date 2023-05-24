export const hoverVariant = () => {
  return {
    hover: {
      scale: 1.025,
      transition: {
        type: "spring",
        duration: 0.2,
      },
    },
  };
};
  
export const glowVariant = () => {
  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        type: "tween",
        delay: 1,
        duration: 1.5,
      },
    },
  };
};
  
export const modalVariant = () => {
  return {
    hidden: {
      x: "-100vw",
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
      },
    },
  };
};
  
export const modalLinksVariant = (index: number) => {
  return {
    hidden: {
      opacity: 0,
      y: -5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4 * index,
      },
    },
  };
};
  
export const textVariant = () => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
      },
    },
  };
};
  
export const fadeIn = (direction: string, duration: number, index?: number) => {
  return {
    hidden: {
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: index === undefined ? duration : duration * index,
        ease: "easeOut",
        when: "beforeChildren",
      },
    },
  };
};