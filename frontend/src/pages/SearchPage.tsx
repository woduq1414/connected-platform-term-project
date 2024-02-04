import { useParams } from "react-router-dom";
import { COMMON_TITLES } from "src/constant";
import GridPage from "src/components/GridPage";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import { useGetGenresQuery } from "src/store/slices/genre";
import { genres } from "src/constant";


export default function SearchPage() {
  const { target } = useParams();
 
  return <GridPage mediaType={MEDIA_TYPE.Movie} target={target} />;
}
