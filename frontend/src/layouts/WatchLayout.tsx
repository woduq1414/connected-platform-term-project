import { Outlet } from "react-router-dom";
import DetailModal from "src/components/DetailModal";
import VideoPortalContainer from "src/components/VideoPortalContainer";
import DetailModalProvider from "src/providers/DetailModalProvider";
import PortalProvider from "src/providers/PortalProvider";
import { Footer, MainHeader } from "src/components/layouts";
import WatchProvider from "src/providers/WatchProvider";

export default function WatchLayout() {
  return (
    <>

      <DetailModalProvider>
        <DetailModal />
        <PortalProvider>
          <WatchProvider>
          <Outlet />
          <VideoPortalContainer />
          </WatchProvider>
        </PortalProvider>
      </DetailModalProvider>

    </>
  );
}
