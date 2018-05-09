/*!
 * Contains function calls for MySQL DB connection and query execution
 * For e.g., use query_associative_all() instead of mysql_query()
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
	
	const db_constants 	= require('include/scripts/blis/include/db_constants');
	const DebugLib 		= require('include/scripts/blis/include/debug_lib');
	const SESSION 		= require('include/scripts/blis/include/session');
	
	let LOG_QUERIES = true;
	
	var con = connect(db_constants.DB_HOST, db_constants.DB_USER, db_constants.DB_PASS);
	if(con != undefined && con != null && con.ID != "")changeDatabase(db_constants.DB_NAME, con);
	
	function connect(host, user, pass){
		if(DB != undefined && DB != null){
			return DB.connect(host, user, pass, "mysql");
		}
		return null;
	}
	
	function changeDatabase(name, con){
		if(con != undefined && con != null){
			con.changeDatabase(name);
		}
	}
	
	function getDatabaseName(con){
		if(con != undefined && con != null){
			return con.getDatabaseName();
		}
		return null;
	}
	
	function queryDatabase(query, con){
		if(con != undefined && con != null){
			
		}
	}
	
	function query_insert_one(query){
		// Single insert statement
		mysql_query( query, con );
		if(LOG_QUERIES == true){
			DebugLib.logQuery(query, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates(query, db_get_current());
		}
	}
	
	function query_update(query){	
		// Single update statement
		mysql_query( query, con );
		LOG_QUERIES = true;
		if(LOG_QUERIES == true)	{
			DebugLib.logQuery(query, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates(query, db_get_current());
		}
	}
	
	function query_delete(query){
		// Single delete from statement
		mysql_query( query, con );
		if(LOG_QUERIES == true)
		{
			DebugLib.logQuery($query, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates($query, db_get_current());
		}
	}

	function query_alter(query){
		// Single ALTER statement
		mysql_query( query, con );
		if(LOG_QUERIES == true)
		{
			DebugLib.logQuery(query, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates(query, db_get_current());
		}
	}
	
	function query_associative_all( query, row_count ) 
	{
		var retval = mysql_query(query, con);
		if(retval != undefined && retval != null){
			return null;
		}		
		row_count = retval.length;
		
		LOG_QUERIES = true;
		if(LOG_QUERIES == true){
			DebugLib.logQuery(query, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates(query, db_get_current());
		}
		return retval;
	}
	
	function query_associative_one(query) {
		var retval = mysql_query(query, con);
		if(retval != undefined && retval != null){
			return null;
		}		
		
		LOG_QUERIES = true;
		if(LOG_QUERIES == true){
			DebugLib.logQuery(query, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates(query, db_get_current());
		}
		return retval;
	}
	
	function query_num_rows(table_name){
		var query_string = "SELECT COUNT(*) AS val FROM "+table_name;
		var record = query_associative_one(query_string);
		if(record != undefined && record != null){
			return null;
		}
		if(LOG_QUERIES == true){
			DebugLib.logQuery(query_string, db_get_current(), SESSION['username']);
			DebugLib.logDBUpdates(query, db_get_current());
		}
		return record['val'];
	}
	
	
	
	
	
	
	
	function db_get_current(){
		//$query_string = "SELECT DATABASE() AS db_name";
		//$record = mysql_query($query_string, $con);
		//$row = mysql_fetch_assoc($record);
		//return $row['db_name'];
		return null;
	}
	
	return {
		version: '0.0.1',
		mysql_connect:connect,
		mysql_select_db:changeDatabase,
		mysql_query:queryDatabase,
		getDatabaseName:getDatabaseName,
		con : con
	};
});