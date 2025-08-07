'use client';

import dynamic from 'next/dynamic';

// 동적으로 불러올 페이지 컴포넌트를 지정
const CustomRequestPage = dynamic(() => import('./CustomRequestPage'));

export default CustomRequestPage;
