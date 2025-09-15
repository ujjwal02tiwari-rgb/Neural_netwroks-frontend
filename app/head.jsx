export default function Head() {
  return (
    <>
      <meta name="api-base" content={process.env.NEXT_PUBLIC_API_BASE_URL} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__API_BASE__ = "${process.env.NEXT_PUBLIC_API_BASE_URL}";`,
        }}
      />
    </>
  );
}
