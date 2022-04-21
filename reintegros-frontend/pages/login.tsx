import Login from '../components/login/login';
import { post } from '../components/api-call/service';
import Cookies from 'universal-cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [error, seterror] = useState(null);
  const router = useRouter();
  const handleSubmit = async (username: String, password: string) => {
    let res;
    try {
      res = await post('api/usuarios/login', { username, password });
      const { access, refresh, user, notifications } = res.data;
      if (access) {
        const cookies = new Cookies();
        cookies.set('access', access, { path: '/' });
        cookies.set('refresh', refresh, { path: '/' });
        cookies.set('username', username, { path: '/' });

        // cookies.set('user', JSON.stringify(user), { path: '/' });
        localStorage.setItem('user', JSON.stringify(user));

        // cookies.set('notifications', JSON.stringify(notifications), { path: '/' });
        localStorage.setItem('notifications', JSON.stringify(notifications));

        router.push('solicitudes');
      } else {
        seterror(res.data?.code);
      }
    } catch (error) {
      seterror(error.response?.data?.code);
    }
  };
  return <Login onSubmit={handleSubmit} error={error} />;
}
