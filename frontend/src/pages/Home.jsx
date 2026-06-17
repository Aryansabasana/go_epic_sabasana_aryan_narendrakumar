import React from 'react';

const Home = () => {
  return (
    <div className="animate-fade-in container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to GoEpic</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
        Your premium repository for advanced Go concurrency patterns, problem-solving, and curated datasets.
      </p>
    </div>
  );
};

export default Home;
