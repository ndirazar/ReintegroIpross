import { useContext } from 'react';
import { LoadingContext } from '../../providers/Loading';

function useLoading() {
  const { loading, isLoading, unsetLoading } = useContext(LoadingContext);
  return { loading, isLoading, unsetLoading };
}

export default useLoading;
