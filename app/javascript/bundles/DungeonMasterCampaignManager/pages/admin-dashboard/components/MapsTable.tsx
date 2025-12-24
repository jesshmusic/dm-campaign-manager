import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from '../../../components/DataTable/DataTable';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiPencil, GiTrashCan } from 'react-icons/gi';
import { NavLink } from '../../../components/NavLink/NavLink';

import { EditButton } from '../AdminDashboard.styles';

interface FoundryMap {
  id: string;
  name: string;
  thumbnail?: string;
  access: string;
  published: boolean;
  tags: string[];
  createdAt: string;
}

const MapsTable: React.FC = () => {
  const [allMaps, setAllMaps] = useState<FoundryMap[]>([]);
  const [maps, setMaps] = useState<FoundryMap[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/v1/maps', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FoundryMap[] = await response.json();
      setAllMaps(data);
      setMaps(data);
    } catch (error) {
      console.error('Error fetching maps:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterMaps = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) {
        setMaps(allMaps);
        return;
      }
      const normalizedSearch = searchTerm.toLowerCase();
      const filtered = allMaps.filter(
        (map) =>
          map.name.toLowerCase().includes(normalizedSearch) ||
          map.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch)),
      );
      setMaps(filtered);
    },
    [allMaps],
  );

  const deleteMap = useCallback(
    async (id: string) => {
      if (!confirm('Are you sure you want to delete this map?')) return;

      try {
        const response = await fetch(`/v1/maps/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          void fetchMaps();
        }
      } catch (error) {
        console.error('Error deleting map:', error);
      }
    },
    [fetchMaps],
  );

  useEffect(() => {
    void fetchMaps();
  }, [fetchMaps]);

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'thumbnail' as const,
        size: 60,
        Cell: ({ value, row }: { value: string; row: { original: { name: string } } }) =>
          value ? (
            <img
              src={value}
              alt={row.original.name}
              style={{ width: 50, height: 38, objectFit: 'cover', borderRadius: 4 }}
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 38,
                background: '#333',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#666',
              }}
            >
              No img
            </div>
          ),
      },
      {
        Header: 'Name',
        accessor: 'name' as const,
      },
      {
        Header: 'Tags',
        accessor: 'tags' as const,
        Cell: ({ value }: { value: string[] }) => value?.slice(0, 3).join(', ') || '-',
      },
      {
        Header: 'Access',
        accessor: 'access' as const,
        size: 80,
      },
      {
        Header: 'Status',
        accessor: 'published' as const,
        size: 80,
        Cell: ({ value }: { value: boolean }) => (value ? 'Published' : 'Draft'),
      },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        size: 100,
        Cell: ({ value }: { value: string }) => (
          <>
            <EditButton>
              <NavLink
                to={`/app/admin-dashboard/foundry-maps?edit=${value}`}
                icon={<GiPencil size={24} />}
                title={'Edit'}
                isButton
              />
            </EditButton>
            <Button
              type="button"
              onClick={() => void deleteMap(value)}
              color={Colors.danger}
              icon={<GiTrashCan size={24} />}
              title="Delete"
              hideTitle
            />
          </>
        ),
      },
    ],
    [deleteMap],
  );

  const data = useMemo(() => {
    return maps.map((map) => ({
      id: map.id,
      name: map.name,
      thumbnail: map.thumbnail,
      tags: map.tags,
      access: map.access,
      published: map.published,
    }));
  }, [maps]);

  const onSearch = useCallback(
    (searchTerm: string) => {
      filterMaps(searchTerm);
    },
    [filterMaps],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      onSearch={onSearch}
      results={data.length}
      noHover
    />
  );
};

export default MapsTable;
