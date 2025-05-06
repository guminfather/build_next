// app/components/Pagination.tsx
type Props = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }: Props) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentGroup = Math.floor((currentPage - 1) / 10);
  const groupStart = currentGroup * 10 + 1;
  const groupEnd = Math.min(groupStart + 9, totalPages);

  const handleClick = (p: number) => {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button onClick={() => handleClick(groupStart - 10)} disabled={groupStart <= 1} className="px-2 py-1 border rounded disabled:opacity-50">
        이전10개
      </button>
      <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">
        이전
      </button>
      {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => (
        <button
          key={i}
          onClick={() => handleClick(groupStart + i)}
          className={`px-3 py-1 border rounded ${currentPage === groupStart + i ? 'bg-blue-500 text-white' : ''}`}
        >
          {groupStart + i}
        </button>
      ))}
      <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">
        다음
      </button>
      <button onClick={() => handleClick(groupStart + 10)} disabled={groupEnd >= totalPages} className="px-2 py-1 border rounded disabled:opacity-50">
        다음10개
      </button>
    </div>
  );
}