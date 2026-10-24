function countColumns(table) {
	let row = null;
	const findRow = (node) => {
		if (row || !Array.isArray(node.children)) return;
		if (node.type === "element" && node.tagName === "tr") {
			row = node;
			return;
		}
		node.children.forEach(findRow);
	};
	findRow(table);
	if (!row) return 0;
	return row.children.filter(
		(child) => child.type === "element" && (child.tagName === "td" || child.tagName === "th"),
	).length;
}

function wrapTables(node) {
	if (!Array.isArray(node.children)) return;

	node.children = node.children.map((child) => {
		wrapTables(child);
		if (child.type === "element" && child.tagName === "table") {
			const columns = countColumns(child);
			return {
				type: "element",
				tagName: "div",
				properties: {
					className: columns >= 4 ? ["hr-table-scroll", "is-wide"] : ["hr-table-scroll"],
					"data-columns": columns,
				},
				children: [child],
			};
		}
		return child;
	});
}

export default function rehypeTableScroll() {
	return (tree) => {
		wrapTables(tree);
	};
}
