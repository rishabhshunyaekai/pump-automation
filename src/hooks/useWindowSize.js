import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    let resizeTimer = -1;
    let resizeObserver;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 50);
    };

    const handleResizes = (entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        const { width, height } = entries[0].contentRect;
        if (width !== windowSize.width || height !== windowSize.height) {
          handleResize();
        }
      });
    };

    resizeObserver = new ResizeObserver(handleResizes);
    resizeObserver.observe(document.body);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [windowSize]);

  return windowSize;
};


// import { useState, useEffect } from 'react';

// export const useWindowSize = () => {
//   const [windowSize, setWindowSize] = useState({
//     width: undefined,
//     height: undefined,
//   });

//   useEffect(() => {
//     let resizeTimer = -1;
//     function handleResize() {
//       clearTimeout(resizeTimer);
//       resizeTimer = setTimeout(() => {
//         setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//       }, 50);
//     }
//     window.addEventListener('resize', handleResize);
//     handleResize();

//     const observerCallback = new  (handleResizes);
//     handleResizes = (entries) => {
//       window.requestAnimationFrame(()=> {
//         if (!Array.isArray(entries) || !entries.length) {
//           return;
//         }
//         handleResize();
//       });
//     };
//     const resizeObserver = new ResizeObserver(handleResizes);

//     return () => {
//       clearTimeout(resizeTimer);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);
//   return windowSize;
// };
