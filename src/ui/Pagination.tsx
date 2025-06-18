interface Props {
    page: number;
    totalPages: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
}

export default function Pagination({ page, totalPages, handlePrevPage, handleNextPage }: Props) {
    return (
        <div data-testid="pagination" className="mt-2 flex justify-center gap-4 items-center">
            <button
                type="button"
                data-testid="pagination-prev"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                type="button"
                data-testid="pagination-next"
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
