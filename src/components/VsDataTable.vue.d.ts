interface Column {
    label: string;
    field: string;
    width?: string;
    sortable?: boolean;
    isKey?: boolean;
}
interface ServerOptions {
    page: number;
    rowsPerPage: number;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
        priority?: number;
    }[];
}
type __VLS_Props = {
    rows?: any[];
    itemSelected?: any[] | null;
    tablename?: string;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
        priority?: number;
    }[];
    serverItemsLength?: number;
    serverOptions?: ServerOptions | null;
    showHeader?: boolean;
    headerText?: string;
    loading?: boolean;
    columns: Column[];
    showSearch?: boolean;
    tableClass?: string | string[] | Record<string, any>;
    rowClass?: string | string[] | Record<string, any>;
    showRowEntries?: boolean;
};
declare var __VLS_14: {}, __VLS_17: `header-${string}`, __VLS_18: {}, __VLS_24: {}, __VLS_27: `cell-${string}`, __VLS_28: {
    item: any;
    value: any;
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_17>]?: (props: typeof __VLS_18) => any;
} & {
    [K in NonNullable<typeof __VLS_27>]?: (props: typeof __VLS_28) => any;
} & {
    filterArea?: (props: typeof __VLS_14) => any;
} & {
    'no-data'?: (props: typeof __VLS_24) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "input-typed": (value: string) => any;
    "update:itemSelected": (value: any[]) => any;
    "update:serverItemsLength": (value: number | undefined) => any;
    "update:serverOptions": (value: ServerOptions) => any;
    "page-updated": (value: number) => any;
    "sort-changed": (sortOptions: {
        field: string;
        order: "asc" | "desc";
        priority?: number;
    }[]) => any;
    "row-click": (row: any, index: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onInput-typed"?: ((value: string) => any) | undefined;
    "onUpdate:itemSelected"?: ((value: any[]) => any) | undefined;
    "onUpdate:serverItemsLength"?: ((value: number | undefined) => any) | undefined;
    "onUpdate:serverOptions"?: ((value: ServerOptions) => any) | undefined;
    "onPage-updated"?: ((value: number) => any) | undefined;
    "onSort-changed"?: ((sortOptions: {
        field: string;
        order: "asc" | "desc";
        priority?: number;
    }[]) => any) | undefined;
    "onRow-click"?: ((row: any, index: number) => any) | undefined;
}>, {
    tablename: string;
    rows: any[];
    itemSelected: any[] | null;
    serverOptions: ServerOptions | null;
    showHeader: boolean;
    headerText: string;
    loading: boolean;
    showSearch: boolean;
    showRowEntries: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=VsDataTable.vue.d.ts.map