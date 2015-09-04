/**
 *  Script for login part
 *  19.1.2015
 */

function updatelength(field, output) {
  var curr_length = document.getElementById(field).value.length;
  var field_mlen = document.getElementById(field).maxLength;
  document.getElementById(output).innerHTML = curr_length+'/'+field_mlen;
  return 1;
}

function valid_length(field, minlength) {
    var length_df = document.getElementById(field).value.length;
    var ret_len;
    
    if (length_df >= minlength && length_df <= document.getElementById(field).maxLength) {
    	// Length is correct
        //update_css_class(field, 2);
        ret_len = 1;
    } else {
    	// Length is wrong
        //update_css_class(field, 1);
        ret_len = 0;
    }
    return ret_len;
}

function compare_valid(field, field2) {
    var fld_val = document.getElementById(field).value;
    var fld2_val = document.getElementById(field2).value;
    var p_valid_r;
    if (fld_val === fld2_val) {
        //update_css_class(field2, 2);
        p_valid_r = 1;
    } else {
        //update_css_class(field2, 1);
        p_valid_r = 0;
    }
    return p_valid_r;
}

function check_v_mail(field) {
    var fld_value = document.getElementById(field).value;
    var is_m_valid = 0;
    var m_valid_r;
    if (fld_value.indexOf('@') >= 1) {
        var m_valid_dom = fld_value.substr(fld_value.indexOf('@')+1);
        if (m_valid_dom.indexOf('@') === -1) {
            if (m_valid_dom.indexOf('.') >= 1) {
                var m_valid_dom_e = m_valid_dom.substr(m_valid_dom.indexOf('.')+1);
                if (m_valid_dom_e.length >= 1) {
                    is_m_valid = 1;
                }
            }
        }
    }
    if (is_m_valid) {
        //update_css_class(field, 2);
        m_valid_r = 1;
    } else {
        //update_css_class(field, 1);
        m_valid_r = 0;
    }
    return m_valid_r;
}

function check_v_pass(field, output) {
    var pass_buf_value = document.getElementById(field).value;
    var pass_level = 0;
    
    if (pass_buf_value.match(/[a-z]/g)) {
        pass_level++;
    }
    if (pass_buf_value.match(/[A-Z]/g)) {
        pass_level++;
    }
    if (pass_buf_value.match(/[0-9]/g)) {
        pass_level++;
    }
    if (pass_buf_value.length < 5) {
        if(pass_level >= 1) pass_level--;
    } else if (pass_buf_value.length >= 20) {
        pass_level++;
    }
    var output_val = '';
    switch (pass_level) {
        case 1: output_val='Weak'; break;
        case 2: output_val='Normal'; break;
        case 3: output_val='Strong'; break;
        case 4: output_val='Very strong'; break;
        default: output_val='Very weak'; break;
    }
    if (document.getElementById(output).value !== pass_level) {
        document.getElementById(output).value = pass_level;
        document.getElementById(output).innerHTML = output_val;
    }
    return 1;
}

function validate_login() {
    var t1 = valid_length('loginuser', 6);
    var t2 = valid_length('password', 6);
	
    var errorlist = '';
    if (! t1) {
        errorlist += 'Login is too short/long<br />';
    }
    if (! t2) {
        errorlist += 'Password is too short/long<br />';
    }

    $( "#errorPanel" ).empty();
    if (errorlist) {
    	build_errorpanel(errorlist);

    	$( "#errorPanel" ).show();    	
        return false;
    }

    //$("#resultBlock").innerHTML = "";
    $( "#errorPanel" ).hide();
    
    return true;
}

function validate_all() {
    var t1 = valid_length('login', 6);
    var t2 = valid_length('password', 6);
    var t3 = compare_valid('password', 'c_password');
    var t4 = check_v_mail('email');
    //t5 = check_v_pass('password', 'pass_result');
    var t6 = valid_length('alias', 3);

    var errorlist = '';
    if (! t1) {
        errorlist += 'Login is too short/long<br />';
    }
    if (! t2) {
        errorlist += 'Password is too short/long<br />';
    }
    if (! t3) {
        errorlist += 'Passwords are not the same<br />';
    }
    if (! t4) {
        errorlist += 'Mail is wrong<br />';
    }
    if (!t6) {
    	errorlist += 'Display as is too short/long<br />';
    }
    
    $( "#errorPanel" ).empty();
    if (errorlist) {
    	build_errorpanel(errorlist);

    	$( "#errorPanel" ).show();    	
        return false;
    }

    //$("#resultBlock").innerHTML = "";
    $( "#errorPanel" ).hide();
    
    return true;
}

function build_errorpanel(errorlist) {
	
	var resultblock = $( "#errorPanel" );
	var newp = $("<p></p>");
	var span = $("<span class='ui-icon ui-icon-alert' style='float: left; margin-right: .3em;'></span>");
	span.appendTo(newp);
	var newstg = $("<strong></strong>").html(errorlist);
	newstg.appendTo(newp);
	newp.appendTo(resultblock);
	
}

