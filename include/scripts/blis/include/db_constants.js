/*!
 * (c) C4G, Santosh Vempala, Ruban Monu and Amol Shintre
 * Contains DB connection parameters
 * Include in db_mysql_lib.js
 *
 * <license>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * </license>
 * <note>
 * blis project is licensed under MIT License. Additional licensing may be required 
 * for other libraries.
 * </note>
 */ 
define(function(require) {
	'use strict';

	const SESSION = require('include/scripts/blis/include/session');
	
	//Flag for toggling between local machine, portable version and arc server
	const ON_DEV = 1;
	const ON_ARC = 2;
	const ON_PORTABLE = 3;
	let SERVER = ON_PORTABLE;

	let LOCAL_PATH = "../../local/";
	if(SERVER == ON_ARC){
		LOCAL_PATH = "../local/";
	}

	const DB_HOST = "localhost";
	const DB_USER = "root";
	
	const GLOBAL_DB_NAME="blis_revamp";

	let DB_NAME = GLOBAL_DB_NAME;	
	let DB_PASS = "";

	if(SERVER == ON_DEV){
		DB_PASS = "monu123";
	}
	else if(SERVER == ON_ARC){
		DB_PASS = "";
	}
	else if(SERVER == ON_PORTABLE){
		DB_PASS = "blis123";
	}

	if(SESSION != undefined && SESSION != null){
		// User has logged in
		if(SESSION['db_name'] == "")
			// Admin level user - keep global DB instance
			DB_NAME = GLOBAL_DB_NAME;
		else
			// Technician user - Narrow down to local instance
			DB_NAME = SESSION['db_name'];
	}
	
	DB_PASS = "flsekaga";
	DB_NAME = "kagacotz_eqa_db_v2";
	
	return {
		version: '0.0.1',
		ON_DEV : ON_DEV,
		ON_ARC : ON_ARC,		
		ON_PORTABLE : ON_PORTABLE,
		SERVER : SERVER,
		LOCAL_PATH : LOCAL_PATH,
		DB_HOST : DB_HOST,
		DB_USER : DB_USER,
		GLOBAL_DB_NAME : GLOBAL_DB_NAME,
		DB_NAME : DB_NAME,
		DB_PASS : DB_PASS
	};
});