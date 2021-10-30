import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>NPM registry</title>
      </Head>
      <div className="container">
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </div>
    </>
  );
}

export default HomePage;
