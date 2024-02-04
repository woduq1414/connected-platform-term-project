import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MaxLineTypography from "./MaxLineTypography";
import PlayButton from "./PlayButton";
import NetflixIconButton from "./NetflixIconButton";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import SimilarVideoCard from "./SimilarVideoCard";
import { useDetailModal } from "src/providers/DetailModalProvider";
import {
  useGetAppendedVideosQuery,
  useGetSimilarVideosQuery,
} from "src/store/slices/discover";
import { MEDIA_TYPE } from "src/types/Common";
import { YoutubePlayer } from "./Player";
import { VideoJsPlayer } from "video.js";
import { CustomMovie } from "src/types/Movie";
import { likeVideoApi, videoDetailApi } from "src/api/video";
import { MAIN_PATH, TOAST_OPTIONS, genresKorMap } from "src/constant";
import toast from "react-hot-toast";

import 'src/styles/customYoutube.css'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// interface DetailModalProps {
//   detail: MovieDetail | null;
//   similarVideos: Movie[];
//   onClose: VoidFunction;
// }

export default function DetailModal() {
  const { detailType, setDetailType } = useDetailModal();

  const [detail, setDetail] = useState<CustomMovie | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    videoDetailApi(detailType.id + "").then((res) => {
      if (res.data) {
        setDetail(res.data.video[0]);
        setIsLiked(res.data.video[0].mylike == 1);
      }
    });

  }, [detailType.id]);

  // const { data: detail } = useGetAppendedVideosQuery(
  //   { mediaType: detailType.mediaType, id: detailType.id ?? 0 },
  //   { skip: !detailType.id }
  // );
  // const { data: similarVideos } = useGetSimilarVideosQuery(
  //   { mediaType: detailType.mediaType, id: detailType.id ?? 0 },
  //   { skip: !detailType.id }
  // );
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [muted, setMuted] = useState(true);

  const handleReady = useCallback((player: VideoJsPlayer) => {
    playerRef.current = player;
    setMuted(player.muted());
  }, []);

  const handleMute = useCallback((status: boolean) => {
    if (playerRef.current) {
      playerRef.current.muted(!status);
      setMuted(!status);
    }
  }, []);

  if (detailType.id) {
    return (
      <Dialog
        id="detail_dialog"
        fullWidth
        scroll="body"
        maxWidth="md"
        open={!!detail}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ p: 0, bgcolor: "#181818" }}>
          <Box
            sx={{
              top: 0,
              left: 0,
              right: 0,
              position: "relative",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "relative",
                height: "calc(9 / 16 * 100%)",
              }}
            >
              <Box sx={{
                visibility: detail?.youtubeUrl != null ? "visible" : "hidden",
                float: detail?.youtubeUrl != null ? "unset" : "left",
              }}>
                <YoutubePlayer
                  videoId={detail?.youtubeUrl}
                  options={{
                    autoplay: true,
                    controls: false,
                    loop: true,
                  }}
                  onReady={handleReady}
                />
              </Box>
              <Box sx={{
                display: detail?.youtubeUrl != null ? "none" : "block",
                marginBottom: "10px",
              }}>
                <img src={
                  "https://image.tmdb.org/t/p/w500_and_h282_face" + detail?.thumbnailUrl

                }
                  style={{
                    width: "100%",
                  }}
                />
              </Box>

              <Box
                sx={{
                  background: `linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)`,
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: "26.09%",
                  opacity: 1,
                  position: "absolute",
                  transition: "opacity .5s",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "transparent",
                  backgroundImage:
                    "linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "0px top",
                  backgroundSize: "100% 100%",
                  bottom: 0,
                  position: "absolute",
                  height: "14.7vw",
                  opacity: 1,
                  top: "auto",
                  width: "100%",
                }}
              />
              <IconButton
                onClick={() => {
                  setDetailType({ mediaType: MEDIA_TYPE.Movie, id: null });
                }}
                sx={{
                  top: 15,
                  right: 15,
                  position: "absolute",
                  bgcolor: "#181818",
                  width: { xs: 22, sm: 40 },
                  height: { xs: 22, sm: 40 },
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                <CloseIcon
                  sx={{ color: "white", fontSize: { xs: 14, sm: 22 } }}
                />
              </IconButton>
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 16,
                  px: { xs: 2, sm: 3, md: 5 },
                }}
              >
                <MaxLineTypography variant="h4" maxLine={1} sx={{ mb: 2 }}>
                  {detail?.title}
                </MaxLineTypography>
                <Stack direction="row" spacing={2} sx={{ mb: 3,
                  alignItems: "center",
                
                }}>
                  <PlayButton sx={{ color: "white", py: 0.5 }}
                    onClick={() => {
                      if (detail?.url == null) {
                        toast("영상이 준비되지 않았어요.", {
                          icon: '❌',
                          style: TOAST_OPTIONS,
                        }
                        )
                        return;
                      }
                      location.href = `/${MAIN_PATH.watch}/${detail?.id}`;
                    }}
                  />
                  {/* <NetflixIconButton>
                    <AddIcon />
                  </NetflixIconButton> */}
                  <NetflixIconButton 
                  sx={{ zIndex: 2, height: 40, width: 40 }}
                  onClick={
                    () => {
                      likeVideoApi(detail?.id + "");

                      if (isLiked) {
                        toast("좋아요를 취소했어요.", {
                          icon: '😒',
                          style: TOAST_OPTIONS,
                        });
                      } else {
                        toast("좋아요!", {
                          icon: '👍',
                          style: TOAST_OPTIONS,
                        });
                      }
                      setIsLiked(!isLiked);
                    }
                  }
                  >
                    {
                      isLiked ? <ThumbUpIcon color="secondary" /> : <ThumbUpOffAltIcon color="white" />
                    }

                  </NetflixIconButton>
                  <Box flexGrow={1} />

                  {
                    detail?.youtubeUrl != null ? (
                      <NetflixIconButton
                        size="large"
                        onClick={() => handleMute(muted)}
                        sx={{ zIndex: 2, height: 40, width: 40 }}
                      >
                        {!muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                      </NetflixIconButton>
                    ) : <>  </>
                  }
                </Stack>

                <Container
                  sx={{
                    p: "0px !important",
                  }}
                >
                  <Grid container spacing={5} alignItems="center">
                    <Grid item xs={12} sm={6} md={8}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {/* <Typography
                          variant="subtitle1"
                          sx={{ color: "success.main" }}
                        >{`${getRandomNumber(100)}% Match`}</Typography> */}
                        {/* <Typography variant="body2">
                          {detail?.release_date.substring(0, 4)}
                        </Typography> */}
                        <AgeLimitChip label={`ALL`} />
                        <Typography variant="subtitle2">{`${formatMinuteToReadable(
                          Math.round(detail?.duration / 60)
                        )}`}</Typography>
                        <QualityChip label="HD" />
                      </Stack>

                      <MaxLineTypography
                        maxLine={3}
                        variant="body1"
                        sx={{ mt: 2 }}
                      >
                        {detail?.summary}
                      </MaxLineTypography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" sx={{ my: 1 }}>
                        {`장르 : ${detail?.genre.split(", ").map(
                          (g) => genresKorMap[g]
                        ).join(", ")}`}
                      </Typography>
                      {/* <Typography variant="body2" sx={{ my: 1 }}>
                        {`Available in : ${detail?.spoken_languages
                          .map((l) => l.name)
                          .join(", ")}`}
                      </Typography> */}
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </Box>

          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
