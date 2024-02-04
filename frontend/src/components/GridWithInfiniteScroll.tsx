import { useRef, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import VideoItemWithHover from "./VideoItemWithHover";
import { CustomGenre, Genre } from "src/types/Genre";
import { PaginatedMovieResult } from "src/types/Common";
import useIntersectionObserver from "src/hooks/useIntersectionObserver";
import { CustomMovie } from "src/types/Movie";
import { videoListApi, videoSearchApi } from "src/api/video";
import { genresKorMap } from "src/constant";

interface GridWithInfiniteScrollProps {
  genre: Genre | CustomGenre;
  data: PaginatedMovieResult;
  target: string;
  handleNext: (page: number) => void;
}
const GridWithInfiniteScroll = (props) => {

  const genre = props.genre;
  const target = props.target;

  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersectionObserver(intersectionRef);

  const [videoList, setVideoList] = useState<CustomMovie[]>([]);

  useEffect(() => {
    if (genre) {
      videoListApi(genre.name).then((res) => {
        if (res.data) {
          console.log(res.data.video);
          let tempVideoList = res.data.video;
          tempVideoList.genre_ids = [genre.id];

          setVideoList(tempVideoList);
        }
      });
    } else if (target) {
      videoSearchApi(target).then((res) => {
        if (res.data) {
          console.log(res.data.video);
          let tempVideoList = res.data.video;
          // tempVideoList.genre_ids = [genre.id];

          setVideoList(tempVideoList);
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     intersection &&
  //     intersection.intersectionRatio === 1 &&
  //     data.page < data.total_pages
  //   ) {
  //     handleNext(data.page + 1);
  //   }
  // }, [intersection]);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: "30px", sm: "60px" },
          pb: 4,
          pt: "150px",
          bgcolor: "inherit",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "text.primary", mb: 2 }}
        >{genre ? `${genresKorMap[genre.name]} 영화` : `검색어 : ${target}`}</Typography>
        <Grid container spacing={2}>
          {videoList.length > 0 ? videoList
            .filter((v) => !!v.thumbnailUrl)
            .map((video, idx) => (
              <Grid
                key={`${video.id}_${idx}`}
                item
                xs={6}
                sm={3}
                md={2}
                sx={{ zIndex: 1 }}
              >
                <VideoItemWithHover video={video} />
              </Grid>
            )) : <Typography
              variant="h6" sx={{ color: "text.primary", mb: 2,
              marginTop: "1rem", marginLeft: "1rem"
            }}
            >
              검색 결과가 없습니다.
              </Typography>}
        </Grid>
      </Container>
      <Box sx={{ display: "hidden" }} ref={intersectionRef} />
    </>
  );
}


export default GridWithInfiniteScroll;