/**
 * Dateformat.js
 */

// Formatter and Parser for Datebox
function dateformatter(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function dateparser(s) {
	if (!s)
		return new Date();
	var ss = (s.split('-'));
	var y = parseInt(ss[0], 10);
	var m = parseInt(ss[1], 10);
	var d = parseInt(ss[2], 10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
		return new Date(y, m - 1, d);
	} else {
		return new Date();
	}
}

function finAssetflag(val) {
	if (val === '1') {
		return '<span style="color:green; font-weight: bold;">资产</span>';
	} else if (val === '0') {
		return '<span style="color:red; font-weight: bold;">负债</span>';
	} else {
		return '<span style="color:red;">Unknown</span>';
	}	
}

function finExpenseFlag(val) {
    if (val === '1' || val === 1) {
        return '<span style="color:red; font-weight: bold;">开支</span>';
    } else if (val === '0' || val === 0) {
        return '<span style="color:green; font-weight: bold;">收入</span>';
    } else {
    	return '<span style="color:red;">Unknown</span>';
    }
}