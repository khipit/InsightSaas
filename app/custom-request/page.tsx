'use client';
import dynamic from 'next/dynamic';
const CustomRequestPage = dynamic(() => import('./CustomRequestPage'), {
    ssr: false,
});
export default CustomRequestPage;
import dynamic from 'next/dynamic';  // ← 중복!
const CustomRequestPage = dynamic(() => import('./CustomRequestPage'), {  // ← 중복!
  ssr: false,
});
export default CustomRequestPage;  // ← 중복!
