/**
 * DataTable Rows Per Page Composable
 */
import { computed, watch } from 'vue';
import { calcTotalPages } from '@/utils/datatable';
export function useDataTableRowsPerPage(props, emit, page, rowsPerPage) {
    // const vsRowsPerPage = ref<number>(props.serverOptions?.rowsPerPage ?? props.rowsPerPage)
    // Reactive rowsPerPage (supports server + client modes)
    const vsRowsPerPage = computed({
        get: () => rowsPerPage.value,
        set: (newValue) => rowsPerPage.value = newValue
    });
    watch(rowsPerPage, (newVal) => {
        const totalRecords = props.serverItemsLength ?? props.rows.length;
        const totalPages = calcTotalPages(totalRecords, newVal);
        if (page.value > totalPages) {
            page.value = totalPages || 1; // fallback to page 1 if no records
        }
        else if (page.value < 1) {
            page.value = 1;
        }
    });
    // Explicit handler (same logic, plus fire extra event)
    const handleRowsPerPage = (newValue) => {
        rowsPerPage.value = newValue;
        emit('rowsPerPageChanged', newValue);
    };
    return {
        vsRowsPerPage,
        handleRowsPerPage,
    };
}
