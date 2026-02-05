import { ref, computed, watch } from 'vue';
import { initFilter } from '@/utils/filters';
import { filterFns } from '@/utils/filterFns';
export function useColumnFilter(data, columns, options) {
    const filters = ref({});
    const filteredData = computed(() => {
        // console.log('InitFilter Filtered:', data.value)
        if (options?.serverMode)
            return data.value;
        return data.value.filter((row) => {
            return columns.every((col) => {
                if (!col.field)
                    return true;
                const filter = filters.value[col.field];
                if (!filter || !filter.type)
                    return true;
                // return applyColumnFilter(row, col, filter)
                const cellValue = row[col.field];
                // Custom inline filter function
                if (col.filter?.filterFn) {
                    return col.filter.filterFn(cellValue, filter.value, row);
                }
                // Registered filter function by key
                if (filter.type === 'custom' && col.filter?.filterKey) {
                    const customFn = filterFns[col.filter.filterKey];
                    if (typeof customFn === 'function') {
                        return customFn(row, col.field, filter);
                    }
                    return true;
                }
                // Use built-in filterFn
                const fn = filterFns[filter.type];
                if (typeof fn === 'function') {
                    return fn(row, col.field, filter);
                }
                return true;
            });
        });
    });
    // Notify parent on server mode
    watch(filters, (newFilters) => {
        if (options?.serverMode && options.onServerFilter) {
            const normalizedFilters = Object.entries(newFilters).reduce((acc, [field, filter]) => {
                if (!filter?.type)
                    return acc;
                const base = {
                    type: filter.type,
                    operator: filter.operator,
                };
                switch (filter.type) {
                    case 'text':
                        acc[field] = {
                            ...base,
                            value: filter.value ?? null,
                        };
                        break;
                    case 'multi-select':
                        acc[field] = {
                            ...base,
                            value: filter.value ?? [],
                        };
                        break;
                    case 'number-range':
                        acc[field] = {
                            ...base,
                            value: filter.value ?? null,
                            min: filter.min ?? null,
                            max: filter.max ?? null,
                        };
                        break;
                    case 'date-range':
                        acc[field] = {
                            ...base,
                            value: filter.value ?? null,
                            start: filter.start ?? null,
                            end: filter.end ?? null,
                        };
                        break;
                    case 'custom':
                        acc[field] = {
                            ...base,
                            value: filter.value,
                            filterKey: filter.filterKey,
                        };
                        break;
                }
                return acc;
            }, {});
            options.onServerFilter(normalizedFilters);
        }
    }, { deep: true });
    // Set or update a filter
    function setFilter(columnKey, filter, type) {
        if (filter) {
            filters.value[columnKey] = initFilter(filter.type, filter);
        }
        else if (type) {
            filters.value[columnKey] = initFilter(type);
        }
    }
    // Clear a filter
    function clearFilter(columnKey, type) {
        if (type) {
            filters.value[columnKey] = initFilter(type);
        }
        else {
            delete filters.value[columnKey];
        }
    }
    return {
        filters,
        filteredData,
        setFilter,
        clearFilter
    };
}
