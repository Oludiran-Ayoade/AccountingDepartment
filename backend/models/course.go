package models

type Course struct {
	Code     string `json:"code"`
	Name     string `json:"name"`
	Level    int    `json:"level"`
	Semester string `json:"semester"`
}

var Courses = []Course{
	// 100 Level - First Semester
	{Code: "GST 111", Name: "Communication in English", Level: 100, Semester: "first"},
	{Code: "LIB 101", Name: "Use of library, Study skills and information communication technology", Level: 100, Semester: "first"},
	{Code: "GEL 101", Name: "Principles and practices of excellent living", Level: 100, Semester: "first"},
	{Code: "ECO 101", Name: "Principles of Economics", Level: 100, Semester: "first"},
	{Code: "BUI-ACC 105", Name: "Business Law", Level: 100, Semester: "first"},
	{Code: "ACC 101", Name: "Introduction to Financial Accounting I", Level: 100, Semester: "first"},
	{Code: "AMS 101", Name: "Principles of Management", Level: 100, Semester: "first"},
	{Code: "AMS 103", Name: "Introduction to Computing", Level: 100, Semester: "first"},

	// 100 Level - Second Semester
	{Code: "GEL 102", Name: "Public Speaking Essentials", Level: 100, Semester: "second"},
	{Code: "AMS 102", Name: "Basic Mathematics", Level: 100, Semester: "second"},
	{Code: "AMS 104", Name: "Principles of Project Management", Level: 100, Semester: "second"},
	{Code: "BUI-ACC 104", Name: "Basic Cost Accounting", Level: 100, Semester: "second"},
	{Code: "BUI-ACC 106", Name: "Business Communications", Level: 100, Semester: "second"},
	{Code: "BUI-ACC 108", Name: "Introduction to Financial Systems I", Level: 100, Semester: "second"},
	{Code: "ACC 102", Name: "Introduction to Financial Accounting II", Level: 100, Semester: "second"},
	{Code: "GST 112", Name: "Nigerian people and culture", Level: 100, Semester: "second"},
	{Code: "EES 101", Name: "Fundamentals of Entrepreneurship", Level: 100, Semester: "second"},

	// 200 Level - First Semester
	{Code: "ACC 201", Name: "Financial Accounting I", Level: 200, Semester: "first"},
	{Code: "ACC 203", Name: "Cooperate Governance and Accounting Ethics", Level: 200, Semester: "first"},
	{Code: "ENT 211", Name: "Entrepreneurship and Innovation", Level: 200, Semester: "first"},
	{Code: "BUI-ACC 205", Name: "Public Sector Accounting and Reporting I", Level: 200, Semester: "first"},
	{Code: "BUI-ACC 207", Name: "Management Information System", Level: 200, Semester: "first"},
	{Code: "BUI-GEL 203", Name: "Principles and Fundamentals of Godly Living", Level: 200, Semester: "first"},
	{Code: "BUI-ITC 201", Name: "Information Technology Certificate I", Level: 200, Semester: "first"},
	{Code: "BUA 205", Name: "Leadership and Governance", Level: 200, Semester: "first"},

	// 200 Level - Second Semester
	{Code: "ACC 202", Name: "Financial Accounting II", Level: 200, Semester: "second"},
	{Code: "ACC 204", Name: "Cost Accounting", Level: 200, Semester: "second"},
	{Code: "ACC 206", Name: "Accounting Laboratory", Level: 200, Semester: "second"},
	{Code: "GST 212", Name: "Philosophy, Logic and Human Existence", Level: 200, Semester: "second"},
	{Code: "BUI-GEL 202", Name: "Godly Disposition", Level: 200, Semester: "second"},
	{Code: "BUI-EES 203", Name: "Knowledge Acquisition", Level: 200, Semester: "second"},
	{Code: "BUI-ITC 202", Name: "Information Technology II", Level: 200, Semester: "second"},
	{Code: "BUA 218", Name: "Green Management", Level: 200, Semester: "second"},

	// 300 Level - First Semester
	{Code: "ACC 301", Name: "Financial Reporting I", Level: 300, Semester: "first"},
	{Code: "ACC 303", Name: "Management Accounting I", Level: 300, Semester: "first"},
	{Code: "ACC 305", Name: "Taxation I", Level: 300, Semester: "first"},
	{Code: "ACC 307", Name: "Audit and Assurance I", Level: 300, Semester: "first"},
	{Code: "BUI-ACC 309", Name: "Financial Management I", Level: 300, Semester: "first"},
	{Code: "ACC 311", Name: "Entrepreneurship in Accounting", Level: 300, Semester: "first"},
	{Code: "BUI-GEL 303", Name: "Sustainable Leadership, Governance and Development", Level: 300, Semester: "first"},
	{Code: "BUI-EES 301", Name: "Knowledge Application", Level: 300, Semester: "first"},
	{Code: "ITC 303", Name: "Analysing Data with Power BI", Level: 300, Semester: "first"},
	{Code: "BUA 313", Name: "Innovation Management", Level: 300, Semester: "first"},

	// 300 Level - Second Semester
	{Code: "ACC 302", Name: "Financial Reporting II", Level: 300, Semester: "second"},
	{Code: "ACC 308", Name: "Public Accounting Sector and Reporting II", Level: 300, Semester: "second"},
	{Code: "GST 312", Name: "Peace and Conflict Resolution", Level: 300, Semester: "second"},
	{Code: "ENT 312", Name: "Venture Creation", Level: 300, Semester: "second"},
	{Code: "BUI-ACC 304", Name: "Accounting Research Methodology I", Level: 300, Semester: "second"},
	{Code: "BUI-GEL 304", Name: "Leadership Imperative Enquiry", Level: 300, Semester: "second"},
	{Code: "BUA 312", Name: "Small Business Management", Level: 300, Semester: "second"},

	// 400 Level - First Semester
	{Code: "ACC 401", Name: "Management Accounting I", Level: 400, Semester: "first"},
	{Code: "ACC 403", Name: "Financial Regulatory Framework and Ethics", Level: 400, Semester: "first"},
	{Code: "ACC 405", Name: "International Accounting", Level: 400, Semester: "first"},
	{Code: "ACC 407", Name: "Advanced Financial Accounting I", Level: 400, Semester: "first"},
	{Code: "ACC 409", Name: "Strategic Financial Management", Level: 400, Semester: "first"},
	{Code: "ACC 431", Name: "Management Information System", Level: 400, Semester: "first"},
	{Code: "BUS 401", Name: "Business Policy and Strategy 1", Level: 400, Semester: "first"},
	{Code: "EES 401", Name: "Strategies for Improving Employability", Level: 400, Semester: "first"},
	{Code: "GEL 401", Name: "Godly Family", Level: 400, Semester: "first"},

	// 400 Level - Second Semester
	{Code: "ACC 402", Name: "Management Accounting II", Level: 400, Semester: "second"},
	{Code: "ACC 404", Name: "Taxation and Fiscal Policy II", Level: 400, Semester: "second"},
	{Code: "ACC 406", Name: "Auditing and Assurance", Level: 400, Semester: "second"},
	{Code: "ACC 408", Name: "Advanced Financial Accounting II", Level: 400, Semester: "second"},
	{Code: "ACC 432", Name: "Public Sector Accounting and Finance II", Level: 400, Semester: "second"},
	{Code: "ACC 434", Name: "Research Project", Level: 400, Semester: "second"},
	{Code: "EES 402", Name: "Unveiling Entrepreneurs", Level: 400, Semester: "second"},
}

func GetCoursesByLevel(level int) []Course {
	var courses []Course
	for _, course := range Courses {
		if course.Level == level {
			courses = append(courses, course)
		}
	}
	return courses
}

func GetCoursesByLevelAndSemester(level int, semester string) []Course {
	var courses []Course
	for _, course := range Courses {
		if course.Level == level && course.Semester == semester {
			courses = append(courses, course)
		}
	}
	return courses
}
