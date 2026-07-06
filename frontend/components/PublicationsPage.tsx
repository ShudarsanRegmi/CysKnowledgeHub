import React, { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Loader2 } from 'lucide-react';
import { Publication } from '../types';
import { getPublications } from '../services/publicationsApi';
import PublicationCard from './PublicationCard';
import PublicationDetailModal from './PublicationDetailModal';
import PublicationsFilter, { FilterState } from './PublicationsFilter';
import PublisherShowcase from './PublisherShowcase';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  publishers: [],
  venueTypes: [],
  kinds: [],
  international: 'all',
  years: [],
};

const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const handleCloseModal = React.useCallback(() => setSelectedPublication(null), []);

  useEffect(() => {
    getPublications()
      .then(setPublications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Derive option lists from all data (not filtered)
  const publisherOptions = useMemo(
    () => [...new Set(publications.map((p) => p.publisher))].sort(),
    [publications]
  );
  const yearOptions = useMemo(
    () =>
      [...new Set(publications.map((p) => Number(p.publicationDate.slice(0, 4))))].sort(
        (a, b) => b - a
      ),
    [publications]
  );

  // Apply all active filters
  const filteredPublications = useMemo(() => {
    const searchLower = filters.search.toLowerCase().trim();

    return [...publications]
      .filter((p) => {
        if (searchLower) {
          const haystack = [p.title, ...p.authors, ...(p.keywords ?? []), p.venue, p.publisher]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(searchLower)) return false;
        }
        if (filters.publishers.length > 0 && !filters.publishers.includes(p.publisher)) return false;
        if (filters.venueTypes.length > 0 && !filters.venueTypes.includes(p.venueType)) return false;
        if (filters.kinds.length > 0 && !filters.kinds.includes(p.kind)) return false;
        if (filters.international === 'yes' && !p.isInternational) return false;
        if (filters.international === 'no' && p.isInternational) return false;
        if (
          filters.years.length > 0 &&
          !filters.years.includes(Number(p.publicationDate.slice(0, 4)))
        )
          return false;
        return true;
      })
      .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));
  }, [filters, publications]);

  // Group filtered results by year for the timeline view
  const publicationsByYear = useMemo(() => {
    return filteredPublications.reduce<Record<number, Publication[]>>((acc, pub) => {
      const year = Number(pub.publicationDate.slice(0, 4));
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    }, {});
  }, [filteredPublications]);

  const years = useMemo(
    () => Object.keys(publicationsByYear).map(Number).sort((a, b) => b - a),
    [publicationsByYear]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Student Publications</h1>
        <div className="w-20 h-1 bg-cyan-500 rounded-full" />
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          A year-wise timeline of student scholarly output across conferences, journals, patents, and research showcases.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : (
        <>
          {/* Publisher Showcase */}
          <PublisherShowcase
            publications={publications}
            filters={filters}
            onFilterChange={setFilters}
          />

          {/* Filter Panel */}
          <PublicationsFilter
            filters={filters}
            onChange={setFilters}
            publisherOptions={publisherOptions}
            yearOptions={yearOptions}
            totalResults={filteredPublications.length}
          />

          {/* Results */}
          {filteredPublications.length === 0 ? (
            <div className="text-center py-20 text-gray-500 space-y-2">
              <p className="text-lg font-semibold text-gray-400">No publications match your filters.</p>
              <p className="text-sm">Try adjusting or clearing the active filters.</p>
            </div>
          ) : (
            <div className="relative pl-0 md:pl-10">
              <div className="hidden md:block absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/30 to-transparent" />

              <div className="space-y-10">
                {years.map((year) => {
                  const pubs = publicationsByYear[year];

                  return (
                    <section key={year} className="relative">
                      <div className="md:absolute md:left-0 md:top-1.5 hidden md:flex w-8 h-8 rounded-full border border-cyan-500/40 bg-white dark:bg-gray-950 items-center justify-center">
                        <BookOpenText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      </div>

                      <div className="md:ml-12 mb-4 flex items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-2">
                        <h2 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{year}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {pubs.length} publication{pubs.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="md:ml-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {pubs.map((publication) => (
                          <PublicationCard
                            key={publication.id ?? publication._id}
                            publication={publication}
                            onClick={setSelectedPublication}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <PublicationDetailModal publication={selectedPublication} onClose={handleCloseModal} />
    </div>
  );
};

export default PublicationsPage;
