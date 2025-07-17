import Button from "./Button";

type Props = {
    page: number;
    totalPages: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
};

export default function Pagination({
    page,
    totalPages,
    handlePrevPage,
    handleNextPage,
}: Props) {
    return (
        <div
            data-testid="pagination"
            className="mt-2 flex justify-center gap-4 items-center"
        >
            <Button
                type="button"
                variant="outline"
                data-testid="pagination-prev"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </Button>
            <span>
                Page {page} of {totalPages}
            </span>
            <Button
                type="button"
                variant="outline"
                data-testid="pagination-next"
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </Button>
        </div>
    );
}
