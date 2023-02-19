import Header from "@/components/Header";

async function getPost(acct: string, postid: string) {
  console.log(`get status for id ${postid} acct ${acct}`);

  // TODO: API Access here

  return {};
}

export default async function SinglePostPage({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}) {
  const data = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));

  return <Header />;
}
