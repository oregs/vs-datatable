/**
 * DataTable Sorting Composable
 */
import { ref, computed, watch } from 'vue';
export function useDataTableSort(props, emit, page) {
    const vsInitialPage = ref(1);
    const localSort = ref(props.sort ? [...props.sort] : []);
    // Watch for external sort changes
    watch(() => props.sort, (newSort) => {
        if (newSort)
            localSort.value = [...newSort];
    }, { deep: true });
    // Active sort (server or client)
    const activeSort = computed(() => props.serverOptions?.sort ?? localSort.value ?? []);
    // Sort helpers
    const isColumnSorted = (field) => {
        return activeSort.value.some((s) => s.field === field);
    };
    const getSortPriority = (field) => {
        const entry = activeSort.value.find((s) => s.field === field);
        return entry ? entry.priority ?? null : null;
    };
    const getSortOrder = (field) => {
        return activeSort.value.find((s) => s.field === field)?.order ?? null;
    };
    const handleSort = (field, event) => {
        let sort = [...localSort.value];
        const index = sort.findIndex((s) => s.field === field);
        if (!event.shiftKey) {
            if (index === -1) {
                sort = [{ field, order: 'asc' }];
            }
            else if (sort[index]?.order === 'asc') {
                sort = [{ field, order: 'desc' }];
            }
            else {
                sort = [];
            }
        }
        else {
            if (index === -1) {
                sort.push({ field, order: 'asc' });
            }
            else if (sort[index]?.order === 'asc') {
                sort[index].order = 'desc';
            }
            else {
                sort.splice(index, 1);
            }
        }
        sort = sort.map((s, i) => ({ ...s, priority: i + 1 }));
        localSort.value = [...sort];
        if (props.serverOptions) {
            emit('update:serverOptions', { ...props.serverOptions, sort });
        }
        else {
            emit('update:sort', sort);
        }
        page.value = vsInitialPage.value;
        emit('sortChanged', { sort });
    };
    const sortHelpers = {
        isColumnSorted,
        getSortPriority,
        getSortOrder,
        handleSort
    };
    return {
        activeSort,
        sortHelpers
    };
}
