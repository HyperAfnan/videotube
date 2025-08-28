import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";

const LazyImage = ({ src, alt, className, width, height, circle = false }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  return (
    <img
      ref={ref}
      src={
        inView ? (
          src
        ) : (
          <Skeleton circle={circle} height={height} width={width} />
        )
      }
      alt={alt}
      className={`${className} transition-opacity duration-300 w-${width} h-${height} ${
        inView ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default LazyImage;
