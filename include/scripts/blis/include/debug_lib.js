/*!
 * (c) C4G, Santosh Vempala, Ruban Monu and Amol Shintre
 * This file contains entity classes and functions for DB queries
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
	
	function getCallerFunctionName(backtrace){
		//// Returns the name of the caller function
		//// i.e. for the function which called this method
		//// Uses result of debug_backtrace()
		//return backtrace[1]['function'];
	}
	
	function getCurrentFunctionName(){
		//// Returns the name of the current function 
		//// i.e. the function which called this method
		//var backtrace = debug_backtrace();
		//return backtrace[1]['function'];
	}
	
	function browserInfo(agent=null) {
		//// Declare known browsers to look for
		//$known = array('msie', 'firefox', 'safari', 'webkit', 'opera', 'netscape',
		//	'konqueror', 'gecko');
        //
		//// Clean up agent and build regex that matches phrases for known browsers
		//// (e.g. "Firefox/2.0" or "MSIE 6.0" (This only matches the major and minor
		//// version numbers.  E.g. "2.0.0.6" is parsed as simply "2.0"
		//$agent = strtolower($agent ? $agent : $_SERVER['HTTP_USER_AGENT']);
		//$pattern = '#(?<browser>' . join('|', $known) .
		//	')[/ ]+(?<version>[0-9]+(?:\.[0-9]+)?)#';
        //
		//// Find all phrases (or return empty array if none found)
		//if (!preg_match_all($pattern, $agent, $matches)) 
		//	return array();
		//
		//// Since some UAs have more than one phrase (e.g Firefox has a Gecko phrase,
		//// Opera 7,8 have a MSIE phrase), use the last one found (the right-most one
		//// in the UA).  That's usually the most correct.
		//$i = count($matches['browser'])-1;
		//return array($matches['browser'][$i] => $matches['version'][$i]);
	}

	function isOldIe(){
		//var browser_info = DebugLib::browserInfo();
		//if(key(browser_info) == 'msie' && browser_info[key($browser_info)] != '8.0')
		//{
		//	return true;
		//}
		return false;
	}
	
	function logQuery(query_string, db_name, username){
		//# Adds current query to log
        //date_default_timezone_set("UTC");
		//$file_name = "../../local/log_".$_SESSION['lab_config_id'].".txt";
		//$file_handle = null;
		//if(file_exists($file_name))
		//	$file_handle = fopen($file_name, "a");
		//else
		//	$file_handle = fopen($file_name, "w");
		//$timestamp = date("Y-m-d H:i:s");
		//$log_line = $timestamp."\t".$username."\t".$db_name."\t".$query_string."\n";
		//fwrite($file_handle, $log_line);
		//fclose($file_handle);
	}
	
	function logDBUpdates(query_string, db_name){
		//# Adds current query to update log
		//$file_name = "../../local/log_".$_SESSION['lab_config_id']."_updates.sql";
		//$file_name_revamp = "../../local/log_".$_SESSION['lab_config_id']."_revamp_updates.sql";
		//$file_handle = null;
		//$file_handle_revamp = null;
		//
		//if(file_exists($file_name)) {
		//	$file_handle = fopen($file_name, "a");
		//}	
		//else {
		//	$file_handle = fopen($file_name, "w");
		//	fwrite($file_handle, "USE blis_".$_SESSION['lab_config_id'].";\n\n");
		//}	
		//	
		//if(file_exists($file_name_revamp)) {
		//	$file_handle_revamp = fopen($file_name_revamp, "a");
		//}	
		//else {
		//	$file_handle_revamp = fopen($file_name_revamp, "w");	
		//	fwrite($file_handle_revamp, "USE blis_revamp;\n\n");
		//}	
		//	
		//$timestamp = date("Y-m-d H:i:s");
		//$log_line = $timestamp."\t".$query_string."\n";
		//$pos = stripos($query_string, "SELECT");
		//
        //if($pos === false) {
		//	if($db_name=="blis_revamp")
		//		fwrite($file_handle_revamp, $log_line);
		//	else
		//		fwrite($file_handle, $log_line);
        //}
		//
		//fclose($file_handle);
		//fclose($file_handle_revamp);
	}
	
	return {
		version: '0.0.1',
		getCallerFunctionName:getCallerFunctionName, 
		getCurrentFunctionName:getCurrentFunctionName,  
		browserInfo:browserInfo,  
		isOldIe:isOldIe,  
		logQuery:logQuery,  
		logDBUpdates:logDBUpdates
	};
});