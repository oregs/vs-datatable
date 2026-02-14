/**
 * DataTable Pagination Composable
 */
import { computed } from 'vue';
import { calculateRecordRange } from '@/utils/datatable';
export function useDataTablePagination(props, emit, page, rowsPerPage, processedRows) {
    // Client-side pagination state
    // const csPage = ref<number>(1)
    const totalRecords = computed({
        get: () => (props.serverItemsLength !== undefined ? props.serverItemsLength : processedRows.value.length),
        set: (newValue) => {
            console.log('serverItemsLength: ', newValue);
            if (props.serverItemsLength !== undefined) {
                emit('update:serverItemsLength', newValue);
            }
        },
    });
    const currentPage = computed({
        get: () => props.serverOptions?.page ?? page.value,
        set: (newValue) => {
            if (props.serverOptions) {
                emit('update:serverOptions', { ...props.serverOptions, page: newValue });
            }
            else {
                page.value = newValue;
            }
        },
    });
    const recordRange = computed(() => {
        const rowsPerPageValue = rowsPerPage.value;
        return calculateRecordRange(page.value, rowsPerPageValue, totalRecords.value);
    });
    const handlePageChange = (newPage) => {
        if (props.serverOptions) {
            emit('update:serverOptions', { ...props.serverOptions, page: newPage });
        }
        emit('pageUpdated', newPage);
    };
    const paginationHelpers = {
        page,
        totalRecords,
        recordRange,
        handlePageChange
    };
    return {
        currentPage,
        totalRecords,
        recordRange,
        handlePageChange,
        paginationHelpers
    };
}
