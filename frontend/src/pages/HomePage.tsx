import Stack from "@mui/material/Stack";
import { COMMON_TITLES } from "src/constant";
import HeroSection from "src/components/HeroSection";
import { useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";



import { genres } from "src/constant";
import { Box } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";

function HomePage() {

  const isMobile = useMediaQuery("(max-width: 600px) or (orientation: portrait)");

  if (genres && genres.length > 0) {
    return (
      <Stack spacing={2} sx={{ bgcolor: "background.default" }}>
        <Box sx={{
          marginTop: isMobile ? '3rem' : 0,
          marginBottom: isMobile ? '5rem' : 0,
        }}>
          <HeroSection mediaType={MEDIA_TYPE.Movie} />
        </Box>

        {[...[
          { name: "Topliked", apiString: "topliked" },
          { name: "Recommend", apiString: "recommend" },
        ], ...genres].map((genre: Genre | CustomGenre) => (

          <SliderRowForGenre
            key={genre.id || genre.name}
            genre={genre}
            mediaType={MEDIA_TYPE.Movie}
          />

        ))}
      </Stack>
    );
  }
  return null;
}

export default HomePage;
