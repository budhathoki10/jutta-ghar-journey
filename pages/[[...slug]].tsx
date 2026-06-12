import dynamic from 'next/dynamic';

const ClientApp = dynamic(() => import('../src/App'), {
  ssr: false,
});

export default function AppPage() {
  return <ClientApp />;
}
