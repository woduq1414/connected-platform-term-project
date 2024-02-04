import Box, { BoxProps } from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

export default function Logo({ sx }: BoxProps) {
  return (
    <RouterLink to={`/${MAIN_PATH.browse}`}>
      <Box
        component="img"
        alt="Netflix Logo"
        src="/assets/gotcha-logo.png"
        width={92}
        height={25}
        sx={{
          ...sx,
        }}
      />
    </RouterLink>
  );
}
