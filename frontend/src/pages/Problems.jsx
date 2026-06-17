import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { FiSearch, FiEye, FiActivity } from 'react-icons/fi';
import '../styles/Problems.css';

const Problems = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse state parameters from URL search query
  const pageParam = Math.max(1, Number(searchParams.get('page')) || 1);
  const difficultyParam = searchParams.get('difficulty') || '';
  const topicParam = searchParams.get('topic') || '';
  const keywordParam = searchParams.get('keyword') || '';

  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const limit = 8; // Number of problems per page

  // Input states (bound to search bar input)
  const [searchInput, setSearchInput] = useState(keywordParam);

  // Fetch topics once
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/topics');
        setTopics(res.data?.data || []);
      } catch (err) {
        console.error('Error fetching topics list:', err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch problems when parameter change triggers
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {
          page: pageParam,
          limit,
          sort: '-createdAt'
        };

        if (difficultyParam) params.difficulty = difficultyParam;
        if (topicParam) params.topic = topicParam;
        if (keywordParam) params.keyword = keywordParam;

        const res = await api.get('/problems', { params });
        
        setProblems(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
        setTotalProblems(res.data?.totalProblems || 0);
      } catch (err) {
        console.error('Error loading problems directory:', err);
        setError('Could not retrieve problems. Server might be offline.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [pageParam, difficultyParam, topicParam, keywordParam]);

  // Sync search input if keywordParam updates from somewhere else (like layout header search)
  useEffect(() => {
    setSearchInput(keywordParam);
  }, [keywordParam]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    
    // Always reset to page 1 on filter changes
    updated.set('page', '1');

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });

    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ keyword: searchInput });
  };

  const handlePageChange = (newPage) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', newPage.toString());
    setSearchParams(updated);
  };

  const handleCardClick = (id) => {
    navigate(`/problems/${id}`);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="problems-header">
          <h1 className="problems-title">Problems Directory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Filter and select from {totalProblems} available Go coding challenges.
          </p>
        </div>

        {/* Filters Container */}
        <div className="filters-bar">
          <div className="filters-left">
            <form className="filter-input-wrapper" onSubmit={handleSearchSubmit}>
              <FiSearch className="filter-search-icon" />
              <input 
                type="text" 
                placeholder="Search problem title or description..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>

            <select 
              className="filter-select"
              value={difficultyParam}
              onChange={(e) => updateFilters({ difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>

            <select 
              className="filter-select"
              value={topicParam}
              onChange={(e) => updateFilters({ topic: e.target.value })}
            >
              <option value="">All Topics</option>
              {topics.map(t => (
                <option key={t._id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="filters-right">
            {keywordParam || difficultyParam || topicParam ? (
              <button 
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => {
                  setSearchInput('');
                  setSearchParams({});
                }}
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: '24px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Problems Grid */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--color-primary-glow)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'borderRotate 1s linear infinite' }} />
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Searching database...</p>
          </div>
        ) : (
          <>
            <div className="problems-grid">
              {problems.length > 0 ? (
                problems.map((problem, index) => {
                  const probNumber = (pageParam - 1) * limit + index + 1;
                  return (
                    <div 
                      key={problem._id} 
                      className="glass-card problem-card glass-card-hover"
                      onClick={() => handleCardClick(problem._id)}
                    >
                      <div className="problem-card-info">
                        <span className="problem-num">#{probNumber.toString().padStart(3, '0')}</span>
                        <div className="problem-main">
                          <span className="problem-title-text">{problem.title}</span>
                          <div className="problem-meta-row">
                            <span className={`tag-difficulty ${problem.difficulty}`}>
                              {problem.difficulty}
                            </span>
                            <span>Category: <strong style={{ color: 'var(--text-secondary)' }}>{problem.topic}</strong></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="problem-stats-row">
                        <div className="problem-stat">
                          <FiEye />
                          <span>{problem.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <FiActivity style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }} />
                  <h3>No problems match the current filter criteria</h3>
                  <p>Try adjusting your search keyword or clearing the filters.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  disabled={pageParam <= 1}
                  onClick={() => handlePageChange(pageParam - 1)}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page <strong>{pageParam}</strong> of <strong>{totalPages}</strong>
                </span>
                <button 
                  className="pagination-btn"
                  disabled={pageParam >= totalPages}
                  onClick={() => handlePageChange(pageParam + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Problems;
