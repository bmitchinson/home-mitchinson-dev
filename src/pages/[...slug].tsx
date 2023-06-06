import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { Config } from "../utils/configuration";
import { Client } from "@notionhq/client";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const notion = new Client({
    auth: Config.notionAPIKey,
  });

  const slugsQueryResults = (await notion.databases.query({
    database_id: Config.slugsDatabaseID,
  })) as { results: any[] };

  const slugs = {} as { [key: string]: string };
  slugsQueryResults.results.forEach(
    ({ properties }: { properties: { url: any; slug: any } }) => {
      const { url, slug } = properties;
      slugs[slug.title[0].plain_text] = url.url;
    }
  );

  const url = context.req.url || "/404";
  const redirectURL = slugs[url] || `${Config.blogURL}${url}`;
  return {
    props: {
      url: redirectURL,
    },
  };
}

export default function Redirect({ url }: { url: string }) {
  return (
    <>
      <Head>
        {url && <meta httpEquiv="Refresh" content={`0; url=${url}`} />}
      </Head>
    </>
  );
}
