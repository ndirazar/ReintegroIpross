import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';

export default function Home() {
  const { push } = useRouter();
  if (typeof window !== 'undefined') {
    const cookies = new Cookies();
    const refresh = cookies.get('refresh');
    const access = cookies.get('access');
    if (refresh && access) {
      push('/usuarios');
    } else {
      push('/login');
    }
  }
  return null;
}
