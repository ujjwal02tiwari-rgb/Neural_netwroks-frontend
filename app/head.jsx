export default function Head() {
  return (
    <>
      <meta name="api-base" content={process.env.NEXT_PUBLIC_API_BASE_URL} />
    </>
  );
}
