export const metadata = {
  title: 'Animal Video Automation',
  description: 'Automated AI video generation and YouTube upload system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
