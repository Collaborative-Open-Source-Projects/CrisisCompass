'use client'

import dynamic from 'next/dynamic';

const DisasterPage = dynamic(() => import('@/components/disasterPage').then(module => module.DisastersPage), {
    ssr: false // This ensures the component is not SSR'd
});

export default function DisasterPageMain() {
    return (
        <div>
            <DisasterPage />
        </div>
    );
}