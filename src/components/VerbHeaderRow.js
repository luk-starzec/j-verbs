import { memo, useMemo, useContext, useEffect, useState } from 'react'
import styles from "./VerbHeaderRow.module.scss";
import { unique } from "../helpers/arrayHelper";
import { AppContext } from "../AppContext";

const VerbHeaderRow = memo(({ isReadSupported }) => {
    const context = useContext(AppContext);
    const [headerItems, setHeaderItems] = useState({ topRow: [], bottomRow: [] });

    const prepareTopHeaderItems = (emptyGroupColumns, namedGroupColumns) => {
        const emptyGroupItems = emptyGroupColumns.map((i) => ({
            ...i,
            key: `c_${i.name}`,
            colSpan: 1,
            rowSpan: 2,
        }));

        const groupNames = namedGroupColumns.map((i) => i.group).filter(unique);
        const namedGroupItems = groupNames.map((i) => ({
            label: i,
            key: `gr_${i}`,
            colSpan: namedGroupColumns.filter((r) => r.group === i).length,
            rowSpan: 1,
        }));

        return emptyGroupItems.concat(namedGroupItems);
    };

    const prepareBottomHeaderItems = (namedGroupColumns) =>
        namedGroupColumns.map((i) => ({
            ...i,
            key: `col_${i.name}`,
            colSpan: 1,
            rowSpan: 1,
        }));

    const isEmptyGroupColumn = (column) =>
        column.group == null || column.group === "";

    const visibleColumns = useMemo(
        () => context.columns.filter((r) => r.isChecked),
        [context?.columns]
    );

    useEffect(() => {
        if (!context?.columns)
            return;

        const emptyGroupColumns = visibleColumns.filter(r => isEmptyGroupColumn(r));
        const namedGroupColumns = visibleColumns.filter(r => !isEmptyGroupColumn(r));

        setHeaderItems({
            topRow: prepareTopHeaderItems(emptyGroupColumns, namedGroupColumns),
            bottomRow: prepareBottomHeaderItems(namedGroupColumns),
        });
    }, [context?.columns, visibleColumns]);

    const renderHeaderRow = ({ label, description, key, rowSpan, colSpan }) => (
        <th rowSpan={rowSpan} colSpan={colSpan} key={key}>
            <div>{label}</div>
            <div className={styles.headerDescription}>{description}</div>
        </th>
    );

    return (
        <thead>
            <tr>
                {isReadSupported &&
                    <th rowSpan={2}></th>
                }
                {headerItems.topRow.map((i) => renderHeaderRow(i))}
            </tr>
            <tr>
                {headerItems.bottomRow.map((i) => renderHeaderRow(i))}
            </tr>
        </thead>
    )
})

export default VerbHeaderRow;