import BottomMenu from "@/components/BottomMenu";
import ClientPreferencesProvider from "@/components/ClientPreferencesProvider";
import SideMenu from "@/components/SideMenu";
import TimelinesWidthLimiter from "@/components/TimelinesWidthLimiter";
import { css } from "@styled-system/css";

export default function TimelinesLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <TimelinesWidthLimiter>
      <div className={ContentWrapper}>
        <SideMenu />
        <main>
          <ClientPreferencesProvider>{children}</ClientPreferencesProvider>
        </main>
      </div>
      <BottomMenu />
    </TimelinesWidthLimiter>
  );
}

const ContentWrapper = css({
  width: "100%",
  sm: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
  },
  "& > nav": {
    position: "sticky",
    // なぞの1px(これがないとずれる)
    // TODO: でもまあこれでも環境によってはずれてるので、そのうち正しく計算式出したい
    top: { base: "calc(16px + 16px + 20px + 1px + 1px + 8px)", lg: "calc(16px + 16px + 20px + 1px + 1px)" },
    width: { base: "60px", lg: "320px" },
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: { base: "60px", lg: "320px" },
  },
  "& > main": {
    flex: "1",
    mb: { base: "calc(16px + 14px + 1rem + 16px)", sm: "0" },
  },
});
