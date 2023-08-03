// Function to create the ag-Grid table
function parseIntegerValue(value) {
	return parseInt(value, 10);
  }
  
function createAgGridTable(data) {
	const columnDefs = [
		{ headerName: 'Course Name', field: 'course_name', filter: 'agTextColumnFilter', sort:"asc", enableRowGroup: true, rowGroup: true, hide: true},
		{ headerName: 'Year', field: 'year', enableRowGroup: true},
		{ headerName: 'Semester', field: 'semester', enableRowGroup: true},
		{ headerName: 'Title', field: 'title', filter: 'agTextColumnFilter' },
		{ headerName: 'AA', field: 'AA', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2) },
		{ 
			headerName: 'AA%', 
			chartDataType: 'series', 
			valueGetter: function (params) {
				const aa = params.data.AA;
				const total = params.data.Total;
				return (total !== 0) ? (aa / total * 100)  : 0;
			}, 
			aggFunc: 'avg', 
			valueFormatter : params => (parseFloat(params.value).toFixed(2)+"%"),
			hide: true,
		} ,
		{ headerName: 'AB', field: 'AB', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2) },
		{ 
			headerName: 'AB%', 
			chartDataType: 'series', 
			valueGetter: function (params) {
				const ab = params.data.AB;
				const total = params.data.Total;
				return (total !== 0) ? (ab / total * 100)  : 0;
			}, 
			aggFunc: 'avg', 
			valueFormatter : params => (parseFloat(params.value).toFixed(2)+"%"),
			hide: true,
		} ,
		{ headerName: 'AU', field: 'AU', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'BB', field: 'BB', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'BC', field: 'BC', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'CC', field: 'CC', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'CD', field: 'CD', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'DD', field: 'DD', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'FR', field: 'FR', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2), hide: true},
		{ headerName: 'Total', field: 'Total', chartDataType: 'series', aggFunc: 'avg', valueFormatter : params => Number.isInteger(params.value)?params.value:parseFloat(params.value).toFixed(2)},
	];

	const gridOptions = {
		columnDefs: columnDefs,
		rowData: data,
		domLayout: 'autoHeight',
		defaultColDef: {
			sortable: true,
			resizable: true,
			filter: 'agNumberColumnFilter',
			menuTabs: ['filterMenuTab', "generalMenuTab", "columnsMenuTab"],
		},
		animateRows: true,
		rowGroupPanelShow: 'always',
		enableCharts: true,
    	enableRangeSelection: true,
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
					else{
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
