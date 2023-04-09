import MainPage from "@/components/MainPage";
import { getAuthorizedAccountSSR } from "@/models/auth";

export default async function Home() {
  const hasLoggedIn = (await getAuthorizedAccountSSR()) !== null;

  return <MainPage hasLoggedIn={hasLoggedIn} />;
}
