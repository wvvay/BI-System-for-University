import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const publicPaths = ['/', '/login', '/register', '/about', '/contacts', '/faq', '/privacy', '/terms',];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicPath = publicPaths.includes(router.pathname);

  return isPublicPath ? (
    <Component {...pageProps} />
  ) : (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  );
} 