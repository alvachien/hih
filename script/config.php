<?php

//
// Global variables
//

// 0. Session part
define('HIH_User_ID', 'HIHUserID', false);
define('HIH_User_Alias', 'HIHUserAlias', false);
define('HIH_Theme', 'HIHTheme', false);
// Debug mode
define('HIH_DEBUGMODE_USER', false, false);
define('HIH_DEBUGMODE_LEARN', false, false);
define('HIH_DEBUGMODE_FINANCE', false, false);
// Activity 
define('HIH_ACTIVITY_CREATE', '01', false);
define('HIH_ACTIVITY_MODIFY', '02', false);
define('HIH_ACTIVITY_DISPLAY', '03', false);
define('HIH_ACTIVITY_DELETE', '04', false);
define('HIH_ACTIVITY_GETLIST', '10', false);
define('HIH_ACTIVITY_GETLIST2', '11', false);
define('HIH_ACTIVITY_GETTREE', '15', false);
define('HIH_ACTIVITY_GETTREECOMBO', '16', false);
define('HIH_ACTIVITY_FORM_CRT', '21', false);
define('HIH_ACTIVITY_FORM_CHG', '22', false);
define('HIH_ACTIVITY_GET_POSTDOCITEM', '25', false);
define('HIH_ACTIVITY_GET_INTORDSRULE', '26', false);
define('HIH_ACTIVITY_LOGOUT', '99', false);
define('HIH_ACTIVITY_CHANGETHEME', '90', false);
define('HIH_ACTIVITY_SETLANG', '91', false);
// I18N
define('HIH_I18N_DOMAIN', 'hih', false);
define('HIH_I18N_DOMAIN_PATH', 'locale/', false);

// 1. MySql part
// 1.1 Database connection part -- need change when setup the website
define('MySqlHost', 'localhost', false);
define('MySqlUser', 'root', false);

// 1.2 Tables, views, procedures
define('MySqlUserTabel', 't_user', false);
define('MySqlLearnCatgTable', 't_learn_ctg', false);
define('MySqlLearnObjTable', 't_learn_obj', false);
define('MySqlLearnObjListView', 'v_learn_obj', false);
define('MySqlLearnObjHierView', 'v_learn_obj2', false);
define('MySqlLearnHistTable', 't_learn_hist', false);
define('MySqlLearnHistListView', 'v_learn_histlist', false);
define('MySqlLearnHistHierView', 'v_learn_histhier', false);
define('MySqlLearnAwardTable', 't_learn_award', false);
define('MySqlLearnAwardView', 'v_learn_award', false);
define('MySqlLearnAwardTable', 't_learn_awd', false);
define('MySqlLearnCategoryCreateProc', 'CREATE_LEARNCATEGORY', false);
define('MySqlLearnObjectCreateProc', 'CREATE_LEARNOBJECT', false);
define('MySqlLearnHistoryCreateProc', 'CREATE_LEARNHISTORY', false);
define('MySqlLearnAwardCreateProc', 'CREATE_LEARNAWARD', false);
define('MySqlFinAccountTable', 't_fin_account', false);
define('MySqlFinAccountView', 'v_fin_account', false);
define('MySqlFinAccountCtgyTable', 't_fin_account_ctgy', false);
define('MySqlFinAccountCreateProc', 'CREATE_FINANCEACCOUNT', false);
define('MySqlFinControlCenterTable', 't_fin_controlcenter', false);
define('MySqlFinCurrencyTable', 't_fin_currency', false);
define('MySqlFinDocumentTypeTable', 't_fin_doc_type', false);
define('MySqlFinDocumentTable', 't_fin_document', false);
define('MySqlFinDocumentView', 'v_fin_document', false);
define('MySqlFinDocumentItemTable', 't_fin_document_item', false);
define('MySqlFinDocumentItemView', 'v_fin_document_item2', false);
define('MySqlFinDocumentItemView3', 'v_fin_document_item3', false);
define('MySqlFinInternalOrderTable', 't_fin_intorder', false);
define('MySqlFinInternalOrderSettRuleTable', 't_fin_intorder_settrule', false);
define('MySqlFinInternalOrderSettRuleView', 'v_fin_internalorder_srule', false);
define('MySqlFinTranTypeTable', 't_fin_tran_type', false);
define('MySqlFinControlCenterCreateProc', 'CREATE_FINANCECONTROLCENTER', false);
define('MySqlFinDailyBalanceReportProc', 'REPORT_FIN_DAILYBALANCE', false);
define('MySqlFinBalanceSheetView', 'v_fin_report_bs3', false);
define('MySqlFinIOReportView', 'v_fin_report_io2', false);
define('MySqlFinCCReportProc', 'REPORT_FIN_CC', false);
define('MySqlFinExchangeRateTab', 't_fin_exrate', false);

// 2. Login part
define('LoginName_MinLength', 6, false);
define('LoginName_MaxLength', 25, false);
define('LoginPassword_MinLength', 6, false);
define('LoginPassword_MaxLength', 50, false);
define('LoginAlias_MinLength', 3, false);
define('LoginAlias_MaxLength', 50, false);
define('LoginEmail_MinLength', 6, false);
define('LoginEmail_MaxLength', 150, false);

// 3. Learn part

// 4. Finance part
define('HIH_FIN_DOCTYPE_Transfer', 2, false);
define('HIH_FIN_TranType_TransferIn', 37, false);
define('HIH_FIN_TranType_TransferOut', 60, false);

?>
