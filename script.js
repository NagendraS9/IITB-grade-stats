// Function to create the ag-Grid table
function parseIntegerValue(value) {
	return parseInt(value, 10);
}

function getContextMenuItems(params) {
	return [
	  'copy',
	  'copyWithHeaders',
	  'paste',
	  'separator',
		{
			name: 'Column Chart',
			action: ()=>onChartMenuItemClicked(params),
		},
    'chartRange',
	  'export',
	];
  }
  function onChartMenuItemClicked(params) {
	console.log(params)
	params.api.createRangeChart({
		chartType: 'groupedColumn',
		cellRange: {
			columns: ['course_name', 'AA', 'AB', 'Total'],
		},
		// other options...
	});
  }
  var gridOptions = {}
  function onFilterTextBoxChanged() {
	gridOptions.api.setQuickFilter(
	  document.getElementById('filter-text-box').value
	);
  }

function createAgGridTable(data) {
	const columnDefs = [
		{ headerName: 'Course Name', field: 'course_name', filter: 'agTextColumnFilter', sort: "asc", enableRowGroup: true, rowGroup: true, hide: true },
		{ headerName: 'Year', field: 'year', enableRowGroup: true },
		{ headerName: 'Semester', field: 'semester', enableRowGroup: true },
		{ headerName: 'Title', field: 'title', filter: 'agTextColumnFilter' },
		{ headerName: 'AA', field: 'AA', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2) },
		{
			headerName: 'AA%',
			chartDataType: 'series',
			valueGetter: function (params) {
				const aa = params.data.AA;
				const total = params.data.Total;
				return (total !== 0) ? (aa / total * 100) : 0;
			},
			aggFunc: 'avg',
			valueFormatter: params => (parseFloat(params.value).toFixed(2) + "%"),
			hide: true,
		},
		{ headerName: 'AB', field: 'AB', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2) },
		{
			headerName: 'AB%',
			chartDataType: 'series',
			valueGetter: function (params) {
				const ab = params.data.AB;
				const total = params.data.Total;
				return (total !== 0) ? (ab / total * 100) : 0;
			},
			aggFunc: 'avg',
			valueFormatter: params => (parseFloat(params.value).toFixed(2) + "%"),
			hide: true,
		},
		{
			headerName: 'AA+AB',
			chartDataType: 'series',
			valueGetter: function (params) {
				return params.data.AB + params.data.AA;
			},
			aggFunc: 'avg',
			valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2),
			hide: true
		},
		{
			headerName: '(AA+AB)%',
			chartDataType: 'series',
			valueGetter: function (params) {
				const aa_ab = params.data.AA + params.data.AB;
				const total = params.data.Total;
				return (total !== 0) ? (aa_ab / total * 100) : 0;
			},
			aggFunc: 'avg',
			valueFormatter: params => (parseFloat(params.value).toFixed(2) + "%"),
		},
		{ headerName: 'AU', field: 'AU', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'BB', field: 'BB', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'BC', field: 'BC', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'CC', field: 'CC', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'CD', field: 'CD', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'DD', field: 'DD', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'FR', field: 'FR', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2), hide: true },
		{ headerName: 'Total', field: 'Total', chartDataType: 'series', aggFunc: 'avg', valueFormatter: params => Number.isInteger(params.value) ? params.value : parseFloat(params.value).toFixed(2) },
	];

	gridOptions = {
		columnDefs: columnDefs,
		rowData: data,
		domLayout: 'autoHeight',
		defaultColDef: {
			sortable: true,
			resizable: true,
			filter: 'agNumberColumnFilter',
			menuTabs: ['filterMenuTab', "generalMenuTab", "columnsMenuTab"],
		},
		suppressMenuHide: true,
		autoGroupColumnDef: {
			cellRenderer: 'agGroupCellRenderer',
			filter: 'agGroupColumnFilter',
		},
		rowSelection: 'multiple',
		groupSelectsChildren: true,
		rowGroupPanelShow: 'always',
		enableCharts: true,
		rowSelection: 'multiple',
		statusBar: {
			statusPanels: [
				{
					statusPanel: 'agTotalAndFilteredRowCountComponent',
					align: 'left',
				}
			],
			popupParent: document.body,
		},
		popupParent: document.body,
		enableRangeSelection: true,
		getContextMenuItems: getContextMenuItems,
	};
	
	// Get the grid container element
	const gridDiv = document.querySelector('#myGrid');

	// Create the ag-Grid table
	new agGrid.Grid(gridDiv, gridOptions);
}

// Read and parse the data from the 'grades.txt' file
function readFileAndCreateTable() {
	fetch('grades.txt')
		.then(response => response.text())
		.then(textData => {
			const lines = textData.trim().split('\n');
			const jsonData = lines.map(line => JSON.parse(line));

			const defaultGradeValue = 0;
			jsonData.forEach(item => {
				const gradeColumns = ['AA', 'AB', 'AU', 'BB', 'BC', 'CC', 'CD', 'DD', 'FR', 'Total'];
				gradeColumns.forEach(grade => {
					if (!item.hasOwnProperty(grade)) {
						item[grade] = defaultGradeValue;
					}
					else {
						item[grade] = Number(item[grade])
					}
				});
			});
			createAgGridTable(jsonData);
		})
		.catch(error => console.error('Error reading file:', error));
}

// Call the function to read the file and create the table when the DOM is ready
document.addEventListener('DOMContentLoaded', readFileAndCreateTable);
