import dynamic from 'next/dynamic';

const CustomRequestPage = dynamic(() => import('./CustomRequestPage'), {
  ssr: false,
});

export default CustomRequestPage;
