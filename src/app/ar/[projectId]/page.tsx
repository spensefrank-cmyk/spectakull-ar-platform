import React from 'react';
import ARProjectClient from './ARProjectClient';

// Required for static export - this must be a server component
export async function generateStaticParams() {
  // Generate static params for common project IDs
  // In production, you might fetch this from your database
  return [
    { projectId: 'business-card-demo' },
    { projectId: 'sample-project-1' },
    { projectId: 'sample-project-2' },
    { projectId: 'demo-ar-experience' }
  ];
}

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ARProjectPage({ params }: Props) {
  const { projectId } = await params;
  return <ARProjectClient projectId={projectId} />;
}
