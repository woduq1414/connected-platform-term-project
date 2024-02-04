import withPagination from "src/hoc/withPagination";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import GridWithInfiniteScroll from "./GridWithInfiniteScroll";

interface GridPageProps {
  genre: Genre | CustomGenre;
  mediaType: MEDIA_TYPE;
  target : string;
}
export default function GridPage({ genre, mediaType, target }: GridPageProps) {
  // const Component = withPagination(
  //   GridWithInfiniteScroll,
  //   mediaType,
  //   genre
  // );
  return <GridWithInfiniteScroll genre={genre} target={target} />;
}
