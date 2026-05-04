import { useState, useEffect } from 'react';
import type { Vacante } from '../data/mock';
import { MOCK_VACANTES } from '../data/mock';
import type { Job } from '../types/dashboard';

interface UseVacantesResult {
  vacantes: Vacante[];
  rawJobs: Job[];
  logoUrl: string;
  companyName: string;
  loading: boolean;
  error: string | null;
}

// Demo Vigía: skip API entirely and serve only local mock data
export function useVacantes(): UseVacantesResult {
  const [vacantes] = useState<Vacante[]>([...MOCK_VACANTES]);
  const [rawJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate brief loading tick so skeleton renders naturally
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return {
    vacantes,
    rawJobs,
    logoUrl: '/logo-vigia.png',
    companyName: 'Vigía Transportes',
    loading,
    error: null,
  };
}
