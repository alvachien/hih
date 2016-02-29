/*======================================================
    Tables 
	Updated date: 2016.2.28
  ====================================================== */

CREATE TABLE IF NOT EXISTS `t_fin_setting` (
  `SETID` varchar(20) NOT NULL,
  `SETVALUE` varchar(80) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`SETID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Finance Setting';

CREATE TABLE IF NOT EXISTS `t_fin_account` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CTGYID` int(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Account';

CREATE TABLE IF NOT EXISTS `t_fin_account_dp` (
  `ACCOUNTID` int(11) NOT NULL,
  `DIRECT` tinyint NOT NULL DEFAULT 1,
  `STARTDATE` date NOT NULL,
  `ENDDATE` date NOT NULL,
  `RPTTYPE` tinyint NOT NULL DEFAULT 1,
  `REFDOCID` int(11) NOT NULL,
  `DEFRRDAYS` varchar(100) DEFAULT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ACCOUNTID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Downpayment account';

CREATE TABLE IF NOT EXISTS `t_fin_account_ctgy` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `ASSETFLAG` tinyint(4) NOT NULL DEFAULT '1',
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Account Category';

CREATE TABLE IF NOT EXISTS `t_fin_controlcenter` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `PARID` int(11) DEFAULT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Cost Center';

CREATE TABLE IF NOT EXISTS `t_fin_currency` (
  `CURR` varchar(5) NOT NULL,
  `NAME` varchar(45) NOT NULL,
  `Symbo` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`CURR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Currency';

CREATE TABLE IF NOT EXISTS `t_fin_doc_type` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Document Type';

CREATE TABLE IF NOT EXISTS `t_fin_exrate` (
  `TRANDATE` date NOT NULL,
  `CURR` varchar(5) NOT NULL,
  `RATE` DECIMAL(17,2) DEFAULT NULL,
  `REFDOCID` INT(11) DEFAULT NULL,
  PRIMARY KEY (`TRANDATE`, `CURR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Finance Exg. Rate';

CREATE TABLE IF NOT EXISTS `t_fin_document` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DOCTYPE` smallint(6) NOT NULL,
  `TRANDATE` date NOT NULL,
  `TRANCURR` varchar(5) NOT NULL,
  `DESP` varchar(45) NOT NULL,
  `EXGRATE` TINYINT NULL DEFAULT NULL,
  `EXGRATE_PLAN` TINYINT NULL DEFAULT NULL,
  `TRANCURR2` varchar(5) NULL DEFAULT NULL,
  `EXGRATE2` DECIMAL(17, 2) NULL DEFAULT NULL,
  `EXGRATE_PLAN2` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Document';

CREATE TABLE IF NOT EXISTS `t_fin_document_item` (
  `DOCID` int(11) NOT NULL,
  `ITEMID` int(11) NOT NULL,
  `ACCOUNTID` int(11) NOT NULL,
  `TRANTYPE` smallint(6) NOT NULL,
  `TRANAMOUNT` DECIMAL(17, 2) NOT NULL,
  `USECURR2` TINYINT NULL DEFAULT NULL,
  `CONTROLCENTERID` int(11) DEFAULT NULL,
  `ORDERID` int(11) DEFAULT NULL,
  `DESP` varchar(45) NOT NULL,
  PRIMARY KEY (`DOCID`,`ITEMID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Document Item';

CREATE TABLE IF NOT EXISTS `t_fin_tmpdoc_dp` (
  `DOCID` int(11) NOT NULL AUTO_INCREMENT,  
  `REFDOCID` int(11) DEFAULT NULL,  
  `ACCOUNTID` int(11) NOT NULL,
  `TRANDATE` date NOT NULL,
  `TRANTYPE` smallint(6) NOT NULL,
  `TRANAMOUNT` DECIMAL(17, 2) NOT NULL,
  `CONTROLCENTERID` int(11) DEFAULT NULL,
  `ORDERID` int(11) DEFAULT NULL,
  `DESP` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`DOCID`)
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Temp doc for Downpayment';

CREATE TABLE IF NOT EXISTS `t_fin_intorder` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `VALID_FROM` date NOT NULL,
  `VALID_TO` date NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Order';

CREATE TABLE IF NOT EXISTS `t_fin_intorder_settrule` (
  `INTORDID` int(11) NOT NULL,
  `RULEID` int(11) NOT NULL,
  `CONTROLCENTERID` int(11) NOT NULL,
  `PRECENT` int(11) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`INTORDID`,`RULEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Settlement Rule of Order';

CREATE TABLE IF NOT EXISTS `t_fin_tran_type` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `EXPENSE` tinyint(4) NOT NULL DEFAULT '0',
  `PARID` smallint(6) DEFAULT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Transaction Type';

-- Learning part
CREATE TABLE IF NOT EXISTS `t_learn_recurtypedates` (
  `ID` smallint(6) NOT NULL,
  `DEFDAYS` int(11) NOT NULL,
  PRIMARY KEY (`ID`, `DEFDAYS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Recur type dates';

CREATE TABLE IF NOT EXISTS `t_learn_award` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `USERID` varchar(25) NOT NULL,
  `ADATE` date NOT NULL,
  `SCORE` int(11) NOT NULL,
  `REASON` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learn award';

CREATE TABLE IF NOT EXISTS `t_learn_ctg` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PARENT_ID` int(11) DEFAULT NULL,
  `NAME` varchar(45) NOT NULL,
  `COMMENT` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learn category';

CREATE TABLE IF NOT EXISTS `t_learn_hist` (
  `USERID` varchar(25) NOT NULL,
  `OBJECTID` int(11) NOT NULL,
  `LEARNDATE` date NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`USERID`, `OBJECTID`, `LEARNDATE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learning history';

CREATE TABLE IF NOT EXISTS `t_learn_obj` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CATEGORY` int(11) DEFAULT NULL,
  `NAME` varchar(45) DEFAULT NULL,
  `CONTENT` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learn Object';

CREATE TABLE IF NOT EXISTS `t_learn_plan` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(45) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learn Plan header';

CREATE TABLE IF NOT EXISTS `t_learn_plandtl` (
  `ID` int(11) NOT NULL,
  `OBJECTID` int(11) NOT NULL,
  `DEFERREDDAY` int(11) NOT NULL DEFAULT 0,
  `RECURTYPE` tinyint(4) NOT NULL DEFAULT 0,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`, `OBJECTID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Learn Plan detail';

CREATE TABLE IF NOT EXISTS `t_learn_planpat` (
  `ID` int(11) NOT NULL,
  `USERID` varchar(25) NOT NULL,
  `STARTDATE` date NOT NULL,
  `STATUS` tinyint(4) DEFAULT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`, `USERID`, `STARTDATE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learn Plan participant';

-- User part
CREATE TABLE IF NOT EXISTS `t_module` (
  `MODULE` varchar(3) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  PRIMARY KEY (`MODULE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Module';

CREATE TABLE IF NOT EXISTS `t_user` (
  `USERID` varchar(25) NOT NULL,
  `DISPLAYAS` varchar(50) NOT NULL,
  `PASSWORD` varchar(150) NOT NULL,
  `CREATEDON` datetime NOT NULL,
  `GENDER` tinyint(4) DEFAULT '0',
  `EMAIL` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User';

CREATE TABLE IF NOT EXISTS `t_user_hist` (
  `USERID` varchar(25) NOT NULL,
  `SEQNO` int(11) NOT NULL,
  `HISTTYP` tinyint(4) NOT NULL,
  `TIMEPOINT` datetime NULL DEFAULT NULL,
  `OTHERS` varchar(50),
  PRIMARY KEY (`USERID`, `SEQNO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User history';

CREATE TABLE IF NOT EXISTS `t_user_prof` (
  `USERID` varchar(25) NOT NULL,
  `MODULE` varchar(3) NOT NULL,
  `READFLAG` tinyint(4) DEFAULT 0,
  `CREATEFLAG` tinyint(4) DEFAULT 0,
  `UPDATEFLAG` tinyint(4) DEFAULT 0,
  `FULLCTRLFLAG` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`USERID`, `MODULE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User Profile';

CREATE TABLE IF NOT EXISTS `t_lib_loc` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(25) NOT NULL,
  `DETAILS` varchar(200) NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Lib location';

CREATE TABLE IF NOT EXISTS `t_language` (
  `LANG` varchar(3) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `NAVNAME` varchar(50) NOT NULL,
  PRIMARY KEY (`LANG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Language';

CREATE TABLE IF NOT EXISTS `t_lib_book` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ISBN` varchar(25) DEFAULT NULL,
  `TYPES` VARCHAR(50) NULL,
  `OTHERS` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book';

CREATE TABLE IF NOT EXISTS `t_lib_booklang` (
  `BOOKID` int(11) NOT NULL,
  `LANG` varchar(3) NOT NULL,
  PRIMARY KEY (`BOOKID`, `LANG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book language';

CREATE TABLE IF NOT EXISTS `t_lib_bookname` (
  `BOOKID` int(11) NOT NULL,
  `NAMEID` int(11) NOT NULL,
  `LANG` varchar(3) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  PRIMARY KEY (`BOOKID`, `NAMEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book name';

CREATE TABLE IF NOT EXISTS `t_lib_person` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  `OTHERS` varchar(100) DEFAULT NULL,
  `TAGS` VARCHAR(100) NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Person';

CREATE TABLE IF NOT EXISTS `t_lib_bookauthor` (
  `BOOKID` int(11) NOT NULL,
  `PERSONID` int(11) NOT NULL,
  `TRANFLAG` tinyint DEFAULT NULL,
  PRIMARY KEY (`BOOKID`, `PERSONID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book author';

CREATE TABLE IF NOT EXISTS `t_lib_org` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  `OTHERS` varchar(100) DEFAULT NULL,
  `TAGS` VARCHAR(100) NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Organization';

CREATE TABLE IF NOT EXISTS `t_lib_bookpress` (
  `BOOKID` int(11) NOT NULL,
  `PRESSID` int(11) NOT NULL,
  PRIMARY KEY (`BOOKID`, `PRESSID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book press';

CREATE TABLE IF NOT EXISTS `t_lib_bookloc` (
  `BOOKID` int(11) NOT NULL,
  `LOCID` int(11) NOT NULL,
  `MEDIA` varchar(25) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`BOOKID`, `LOCID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book location';

CREATE TABLE IF NOT EXISTS `t_lib_setting` (
  `SETNAME` varchar(20) NOT NULL,
  `SETDESP` varchar(50),
  `SETVALUE` varchar(100) NOT NULL,
  PRIMARY KEY (`SETNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Lib setting';

CREATE TABLE IF NOT EXISTS `t_lib_booktype` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  `OTHERS` varchar(50) DEFAULT NULL,
  `PARID` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book type';

CREATE TABLE IF NOT EXISTS `t_lib_bookgroup` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  `OTHERS` varchar(50) DEFAULT NULL,
  `PARID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book group';

CREATE TABLE IF NOT EXISTS `t_lib_bookgroup_cont` (
  `GRPID` int(11) NOT NULL,
  `BOOKID` int(11) NOT NULL,
  PRIMARY KEY (`GRPID`, `BOOKID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Book group content';

/*======================================================
    Views 
  ====================================================== */
  
-- Finance part
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_account` AS
    select 
        `tab_a`.`ID` AS `id`,
        `tab_a`.`CTGYID` AS `ctgyid`,
        `tab_a`.`NAME` AS `name`,
        `tab_a`.`COMMENT` AS `comment`,
        `tab_b`.`NAME` AS `ctgyname`,
        `tab_b`.`ASSETFLAG` AS `assetflag`
    from
        (`t_fin_account` `tab_a`
        left join `t_fin_account_ctgy` `tab_b` ON ((`tab_a`.`CTGYID` = `tab_b`.`ID`)));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document_item1` AS
    select 
        `t_fin_document_item`.`DOCID` AS `docid`,
        `t_fin_document_item`.`ITEMID` AS `itemid`,
        `t_fin_document_item`.`ACCOUNTID` AS `accountid`,
        `t_fin_document_item`.`TRANTYPE` AS `trantype`,
		`t_fin_document_item`.`USECURR2` AS `usecurr2`,
        (case when (`t_fin_document_item`.`USECURR2` is null or `t_fin_document_item`.`USECURR2` = '') then (`t_fin_document`.`TRANCURR`)
        else (`t_fin_document`.`TRANCURR2`)
        end) AS `trancurr`,
        `t_fin_document_item`.`TRANAMOUNT` as `tranamount_org`,
        (case
            when (`t_fin_tran_type`.`EXPENSE` = 1) then (`t_fin_document_item`.`TRANAMOUNT` * -(1))
            when (`t_fin_tran_type`.`EXPENSE` = 0) then `t_fin_document_item`.`TRANAMOUNT`
        end) AS `tranamount`,
        (case when (`t_fin_document_item`.`USECURR2` is null or `t_fin_document_item`.`USECURR2` = '') 
			then (
                case when (`t_fin_document`.`EXGRATE` IS NOT NULL) then (
					case
						when (`t_fin_tran_type`.`EXPENSE` = 1) then (`t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE`  * -(1))
						when (`t_fin_tran_type`.`EXPENSE` = 0) then `t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE`
					end)
                else (
                case
					when (`t_fin_tran_type`.`EXPENSE` = 1) then (`t_fin_document_item`.`TRANAMOUNT` * -(1))
					when (`t_fin_tran_type`.`EXPENSE` = 0) then `t_fin_document_item`.`TRANAMOUNT`
				end)
                end)
        else ( case when (`t_fin_document`.`EXGRATE2` IS NOT NULL) then (
					case
						when (`t_fin_tran_type`.`EXPENSE` = 1) then (`t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE2`  * -(1))
						when (`t_fin_tran_type`.`EXPENSE` = 0) then `t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE2`
					end)
                else (
					case
						when (`t_fin_tran_type`.`EXPENSE` = 1) then (`t_fin_document_item`.`TRANAMOUNT` * -(1))
						when (`t_fin_tran_type`.`EXPENSE` = 0) then `t_fin_document_item`.`TRANAMOUNT`
					end)
                end)
        end) AS `tranamount_lc`,
        `t_fin_document_item`.`CONTROLCENTERID` AS `CONTROLCENTERID`,
        `t_fin_document_item`.`ORDERID` AS `ORDERID`,
        `t_fin_document_item`.`DESP` AS `desp`
    from
        `t_fin_document_item`
		join `t_fin_tran_type` on `t_fin_document_item`.`TRANTYPE` = `t_fin_tran_type`.`ID`
        left outer join `t_fin_document` on `t_fin_document_item`.`DOCID` = `t_fin_document`.`ID`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document_item2` AS
    select 
        `t_fin_document_item`.`DOCID` AS `docid`,
        `t_fin_document_item`.`ITEMID` AS `itemid`,
        `t_fin_document_item`.`ACCOUNTID` AS `accountid`,
        `t_fin_document_item`.`TRANTYPE` AS `trantype`,
        `t_fin_document_item`.`USECURR2` AS `usecurr2`,
        (case
            when
                (isnull(`t_fin_document_item`.`USECURR2`)
                    or (`t_fin_document_item`.`USECURR2` = ''))
            then
                `t_fin_document`.`TRANCURR`
            else `t_fin_document`.`TRANCURR2`
        end) AS `trancurr`,
        `t_fin_document_item`.`TRANAMOUNT` AS `tranamount_org`,
        `t_fin_tran_type`.`EXPENSE` AS `trantype_EXPENSE`,
        `t_fin_document_item`.`TRANAMOUNT` AS `tranamount`,
        (case
            when
                (isnull(`t_fin_document_item`.`USECURR2`)
                    or (`t_fin_document_item`.`USECURR2` = ''))
            then
                (case
                    when (`t_fin_document`.`EXGRATE` is not null) then (`t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE`)
                    else `t_fin_document_item`.`TRANAMOUNT`
                end)
            else (case
                when (`t_fin_document`.`EXGRATE2` is not null) then (`t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE2`)
                else `t_fin_document_item`.`TRANAMOUNT`
            end)
        end) AS `tranamount_lc`,
        `t_fin_document_item`.`CONTROLCENTERID` AS `CONTROLCENTERID`,
        `t_fin_document_item`.`ORDERID` AS `ORDERID`,
        `t_fin_document_item`.`DESP` AS `desp`,
        `t_fin_document`.`TRANDATE` AS `TRANDATE`
    from
        ((`t_fin_document_item`
        join `t_fin_tran_type` ON ((`t_fin_document_item`.`TRANTYPE` = `t_fin_tran_type`.`ID`)))
        left join `t_fin_document` ON ((`t_fin_document_item`.`DOCID` = `t_fin_document`.`ID`)));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document_item3` AS
    select 
        `t_fin_document_item`.`DOCID` AS `docid`,
        `t_fin_document_item`.`ITEMID` AS `itemid`,
        `t_fin_document_item`.`ACCOUNTID` AS `accountid`,
        `t_fin_document_item`.`TRANTYPE` AS `trantype`,
        `t_fin_document_item`.`USECURR2` AS `usecurr2`,
        (case
            when
                (isnull(`t_fin_document_item`.`USECURR2`)
                    or (`t_fin_document_item`.`USECURR2` = ''))
            then
                `t_fin_document`.`TRANCURR`
            else `t_fin_document`.`TRANCURR2`
        end) AS `trancurr`,
        `t_fin_document_item`.`TRANAMOUNT` AS `tranamount_org`,
        `t_fin_tran_type`.`EXPENSE` AS `trantype_EXPENSE`,
        `t_fin_document_item`.`TRANAMOUNT` AS `tranamount`,
        (case
            when
                (isnull(`t_fin_document_item`.`USECURR2`)
                    or (`t_fin_document_item`.`USECURR2` = ''))
            then
                (case
                    when (`t_fin_document`.`EXGRATE` is not null) then (`t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE`)
                    else `t_fin_document_item`.`TRANAMOUNT`
                end)
            else (case
                when (`t_fin_document`.`EXGRATE2` is not null) then (`t_fin_document_item`.`TRANAMOUNT` / `t_fin_document`.`EXGRATE2`)
                else `t_fin_document_item`.`TRANAMOUNT`
            end)
        end) AS `tranamount_lc`,
        `t_fin_document_item`.`CONTROLCENTERID` AS `CONTROLCENTERID`,
        `t_fin_document_item`.`ORDERID` AS `ORDERID`,
        `t_fin_document_item`.`DESP` AS `desp`,
        `t_fin_document`.`TRANDATE` AS `TRANDATE`,
        `ctgytab`.`ID` AS `CATEGORYID`,
        `ctgytab`.`NAME` AS `CATEGORYNAME`,
        `ctgytab`.`ASSETFLAG` AS `CATEGORYASSETFLAG`        
    from
        ((`t_fin_document_item`
        join `t_fin_tran_type` ON ((`t_fin_document_item`.`TRANTYPE` = `t_fin_tran_type`.`ID`)))
        join `t_fin_account` `accounttab` ON ((`t_fin_document_item`.`ACCOUNTID` = `accounttab`.`ID`))
        join `t_fin_account_ctgy` `ctgytab` ON ((`accounttab`.`CTGYID` = `ctgytab`.`ID`))
		  left join `t_fin_document` ON ((`t_fin_document_item`.`DOCID` = `t_fin_document`.`ID`))) ;
          	
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document` AS
    select 
        `t_fin_document`.`ID` AS `id`,
        `t_fin_document`.`DOCTYPE` AS `doctype`,
        `t_fin_document`.`TRANDATE` AS `trandate`,
        `t_fin_document`.`TRANCURR` AS `trancurr`,
        `t_fin_document`.`DESP` AS `desp`,
        `t_fin_document`.`EXGRATE` AS `exgrate`,
        `t_fin_document`.`EXGRATE_PLAN` AS `exgrate_plan`,
        `t_fin_document`.`TRANCURR2` AS `trancurr2`,
        `t_fin_document`.`EXGRATE2` AS `exgrate2`,
        `t_fin_document`.`EXGRATE_PLAN2` AS `exgrate_plan2`,
        sum(`v_fin_document_item1`.`tranamount_lc`) AS `tranamount`
    from
        `t_fin_document`
        left join `v_fin_document_item1` ON (`t_fin_document`.`ID` = `v_fin_document_item1`.`docid`)  
    where `t_fin_document`.`DOCTYPE` != 3 AND `t_fin_document`.`DOCTYPE` != 2    
    group by `t_fin_document`.`ID`
    
    union all
    
    select 
        `t_fin_document`.`ID` AS `id`,
        `t_fin_document`.`DOCTYPE` AS `doctype`,
        `t_fin_document`.`TRANDATE` AS `trandate`,
        `t_fin_document`.`TRANCURR` AS `trancurr`,
        `t_fin_document`.`DESP` AS `desp`,
        `t_fin_document`.`EXGRATE` AS `exgrate`,
        `t_fin_document`.`EXGRATE_PLAN` AS `exgrate_plan`,
        `t_fin_document`.`TRANCURR2` AS `trancurr2`,
        `t_fin_document`.`EXGRATE2` AS `exgrate2`,
        `t_fin_document`.`EXGRATE_PLAN2` AS `exgrate_plan2`,
        0 AS `tranamount`
    from
        `t_fin_document`
    where `t_fin_document`.`DOCTYPE` = 3 OR `t_fin_document`.`DOCTYPE` = 2;
		
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_internalorder_srule` AS
    select 
        `tab_a`.`ID` AS `intordid`,
        `tab_a`.`NAME` AS `intordname`,
        `tab_a`.`VALID_FROM` AS `intordvalidfrom`,
        `tab_a`.`VALID_TO` AS `intordvalidto`,
        `tab_b`.`RULEID` AS `ruleid`,
        `tab_b`.`CONTROLCENTERID` AS `controlcenterid`,
        `tab_c`.`NAME` AS `controlcentername`,
        `tab_b`.`PRECENT` AS `precent`,
        `tab_b`.`COMMENT` AS `comment`
    from
        ((`t_fin_intorder` `tab_a`
        left join `t_fin_intorder_settrule` `tab_b` ON ((`tab_a`.`ID` = `tab_b`.`INTORDID`)))
        left join `t_fin_controlcenter` `tab_c` ON ((`tab_b`.`CONTROLCENTERID` = `tab_c`.`ID`)));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_bs1` AS
    select 
        `docid` AS `docid`,
        `itemid` AS `itemid`,
        `accountid` AS `accountid`,
        `trantype` AS `trantype`,
		`usecurr2` AS `usecurr2`,
        `trancurr` AS `trancurr`,
        `tranamount_lc` AS `tranamount_lc`,
		round(sum(`tranamount_lc`), 2) AS `balance_lc`,
        `CONTROLCENTERID` AS `CONTROLCENTERID`,
        `ORDERID` AS `ORDERID`,
        `desp` AS `desp`,
        `accounttab`.`CTGYID` AS `categoryid`,
        `ctgytab`.`ASSETFLAG` AS `categoryassetflag`
    from
        `v_fin_document_item1`
        join `t_fin_account` `accounttab` ON ((`v_fin_document_item1`.`ACCOUNTID` = `accounttab`.`ID`))
        join `t_fin_account_ctgy` `ctgytab` ON ((`accounttab`.`CTGYID` = `ctgytab`.`ID`))
    where `ctgytab`.`ASSETFLAG` = 0 or `ctgytab`.`ASSETFLAG` = 1
	group by `accountid`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_bs3` AS
    select 
        `v_fin_report_bs1`.`accountid` AS `accountid`,
        `v_fin_report_bs1`.`categoryid` AS `categoryid`,
        `v_fin_report_bs1`.`categoryassetflag` AS `categoryassetflag`,
        (case
            when (`v_fin_report_bs1`.`categoryassetflag` = 1) then `v_fin_report_bs1`.`balance_lc`
            else 0
        end) AS `debitbalance`,
        (case
            when (`v_fin_report_bs1`.`categoryassetflag` = 0) then (-(1) * `v_fin_report_bs1`.`balance_lc`)
            else 0
        end) AS `creditbalance`,
        `v_fin_report_bs1`.`balance_lc` AS `balance`
    from
        `v_fin_report_bs1`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_bs2` AS
    select 
        `accountid` AS `accountid`,
        `trantype_EXPENSE`,
		round(sum(`tranamount_lc`), 2) AS `balance_lc`,
        `accounttab`.`CTGYID` AS `categoryid`,
        `ctgytab`.`ASSETFLAG` AS `categoryassetflag`
    from
        `v_fin_document_item2`
        join `t_fin_account` `accounttab` ON ((`v_fin_document_item2`.`ACCOUNTID` = `accounttab`.`ID`))
        join `t_fin_account_ctgy` `ctgytab` ON ((`accounttab`.`CTGYID` = `ctgytab`.`ID`))
    where `ctgytab`.`ASSETFLAG` = 0 or `ctgytab`.`ASSETFLAG` = 1
	group by `accountid`, `trantype_EXPENSE`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_bs4_1` AS
    select 
        `t_fin_account`.`ID` AS `accountid`,
        `t_fin_account`.`CTGYID` AS `categoryid`,
        (case
            when (`v_fin_report_bs2`.`balance_lc` is not null) then `v_fin_report_bs2`.`balance_lc`
            else 0.0
        end) AS `balance_lc`
    from
        (`t_fin_account`
        left join `v_fin_report_bs2` ON (((`t_fin_account`.`ID` = `v_fin_report_bs2`.`accountid`)
            and (`v_fin_report_bs2`.`trantype_EXPENSE` = 0))));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_bs4_2` AS
    select 
        `t_fin_account`.`ID` AS `accountid`,
        `t_fin_account`.`CTGYID` AS `categoryid`,
        (case
            when (`v_fin_report_bs2`.`balance_lc` is not null) then `v_fin_report_bs2`.`balance_lc`
            else 0.0
        end) AS `balance_lc`
    from
        (`t_fin_account`
        left join `v_fin_report_bs2` ON (((`t_fin_account`.`ID` = `v_fin_report_bs2`.`accountid`)
            and (`v_fin_report_bs2`.`trantype_EXPENSE` = 1))));
 
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_bs4` AS
    select 
        `a`.`accountid` AS `accountid`,
        `a`.`balance_lc` AS `debit_balance`,
        `b`.`balance_lc` AS `credit_balance`,
        (`a`.`balance_lc` - `b`.`balance_lc`) AS `balance`,
        `a`.`categoryid` AS `categoryid`
    from
        (`v_fin_report_bs4_1` `a`
        join `v_fin_report_bs4_2` `b` ON ((`a`.`accountid` = `b`.`accountid`)));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_cc1` AS
select 
        `t_fin_controlcenter`.`ID` AS `ccid`,
        `t_fin_controlcenter`.`NAME` AS `ccname`,
        `t_fin_controlcenter`.`PARID` AS `ccparid`,
		round(sum(`v_fin_document_item1`.`tranamount_lc`), 2) AS `tranamount_lc_sum`
    from
        `t_fin_controlcenter`
        left outer join `v_fin_document_item1` ON `t_fin_controlcenter`.`ID` = `v_fin_document_item1`.`CONTROLCENTERID`
		group by `ccid`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_io1` AS
    select 
        `ordertab`.`ID` AS `ordid`,
        `ordertab`.`NAME` AS `ordname`,
        `ordertab`.`VALID_FROM` AS `valid_from`,
        `ordertab`.`VALID_TO` AS `valid_to`,
        `ordertab`.`COMMENT` AS `ordcomment`,
		round(sum(`v_fin_document_item1`.`tranamount_lc`), 2) AS `tranamount_lc_sum`
    from
        `t_fin_intorder` `ordertab`
        left outer join `v_fin_document_item1` ON `ordertab`.`ID` = `v_fin_document_item1`.`ORDERID`
		group by `ordid`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_io2_1` AS
    select 
        tab_a.`id`,
        tab_a.`name`,
        tab_a.`valid_from`,
        tab_a.`valid_to`,
        round(sum(tab_b.`tranamount`), 2) as tranamount
    from `t_fin_intorder` tab_a
    left outer join `v_fin_document_item2` tab_b
        on tab_a.`id` = tab_b.`orderid`
        and tab_b.`trantype_EXPENSE` = 0
    group by tab_a.`id`;

-- View: v_fin_report_io2_2
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_io2_2` AS
    select 
        tab_a.`id`,
        tab_a.`name`,
        tab_a.`valid_from`,
        tab_a.`valid_to`,
        round(sum(tab_b.`tranamount`), 2) as tranamount
    from `t_fin_intorder` tab_a
    left outer join `v_fin_document_item2` tab_b
        on tab_a.`id` = tab_b.`orderid`
        and tab_b.`trantype_EXPENSE` = 1
    group by tab_a.`id`;
 
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_report_io2` AS
    select 
        tab_a.`id`,
        tab_a.`name`,
        tab_a.`valid_from`,
        tab_a.`valid_to`,
        (case when tab_a.`tranamount` is not null then tab_a.`tranamount` else 0.0 end) as debit_tranamount,
        (case when tab_b.`tranamount` is not null then tab_b.`tranamount` else 0.0 end) as credit_tranamount,
        (case when tab_a.`tranamount` is not null then tab_a.`tranamount` else 0.0 end) - (case when tab_b.`tranamount` is not null then tab_b.`tranamount` else 0.0 end) as tranamount
    from `v_fin_report_io2_1` tab_a
    join `v_fin_report_io2_2` tab_b
        on tab_a.`id` = tab_b.`id`;

CREATE OR REPLACE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_dpdoc` 
    AS
SELECT taba.DOCID, taba.REFDOCID, taba.ACCOUNTID, tabe.NAME AS accountname, taba.TRANDATE, 
	taba.TRANTYPE, tabd.NAME AS trantypename, taba.TRANAMOUNT, taba.CONTROLCENTERID, tabb.NAME AS ccname, 
	taba.ORDERID, tabc.NAME AS ordername, taba.DESP, 
    tabg.trancurr, tabg.exgrate, tabg.exgrate_plan
FROM t_fin_tmpdoc_dp AS taba
    LEFT OUTER JOIN t_fin_controlcenter AS tabb ON taba.CONTROLCENTERID = tabb.id
    LEFT OUTER JOIN t_fin_intorder AS tabc ON taba.ORDERID = tabc.ID
    LEFT OUTER JOIN t_fin_tran_type AS tabd ON taba.TRANTYPE = tabd.id
    INNER JOIN t_fin_account AS tabe ON taba.ACCOUNTID = tabe.ID
    INNER JOIN t_fin_account_dp AS tabf ON tabe.ID = tabf.ACCOUNTID
    INNER JOIN t_fin_document AS tabg ON tabf.REFDOCID = tabg.ID;

-- Learing part
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_learn_obj` AS
    select 
        `a`.`ID` AS `ID`,
        `a`.`CATEGORY` AS `CATEGORY_ID`,
        `b`.`NAME` AS `CATEGORY_NAME`,
        `a`.`NAME` AS `NAME`,
        `a`.`CONTENT` AS `CONTENT`
    from
        (`t_learn_obj` `a`
        join `t_learn_ctg` `b` ON ((`a`.`CATEGORY` = `b`.`ID`)));
		
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_learn_obj2` AS
    select 
        `a`.`ID` AS `CATEGORY_ID`,
        `a`.`NAME` AS `CATEGORY_NAME`,
        `a`.`PARENT_ID` AS `CATEGORY_PAR_ID`,
        `b`.`ID` AS `OBJECT_ID`,
        `b`.`NAME` AS `OBJECT_NAME`,
        `b`.`CONTENT` AS `OBJECT_CONTENT`
    from
        (`t_learn_ctg` `a`
        left join `t_learn_obj` `b` ON ((`a`.`ID` = `b`.`CATEGORY`)));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_learn_histobj` AS
    select 
        `hist`.`USERID` AS `userid`,
        `hist`.`LEARNDATE` AS `learndate`,
        `obj`.`ID` AS `objectid`,
        `obj`.`NAME` AS `objectname`,
        `obj`.`CATEGORY` AS `categoryid`,
        `obj`.`CONTENT` AS `objectcontent`
    from
        (`t_learn_hist` `hist`
        join `t_learn_obj` `obj` ON ((`hist`.`OBJECTID` = `obj`.`ID`)));

CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_learn_histhier` AS
    select 
        `ctgy`.`ID` AS `categoryid`,
        `ctgy`.`PARENT_ID` AS `categoryparid`,
        `ctgy`.`NAME` AS `categoryname`,
        `user`.`USERID` AS `userid`,
        `user`.`DISPLAYAS` AS `displayas`,
        `histobj`.`learndate` AS `learndate`,
        `histobj`.`objectid` AS `objectid`,
        `histobj`.`objectname` AS `objectname`,
        `histobj`.`objectcontent` AS `objectcontent`
    from
        ((`t_learn_ctg` `ctgy`
        left join `v_learn_histobj` `histobj` ON ((`ctgy`.`ID` = `histobj`.`categoryid`)))
        left join `t_user` `user` ON ((`histobj`.`userid` = `user`.`USERID`)));
		
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_learn_histlist` AS
    select 
        `hist`.`USERID` AS `userid`,
        `user`.`DISPLAYAS` AS `displayas`,
        `hist`.`OBJECTID` AS `objectid`,
        `obj`.`NAME` AS `objectname`,
        `obj`.`CATEGORY` AS `categoryid`,
        `ctgy`.`NAME` AS `categoryname`,
        `hist`.`LEARNDATE` AS `learndate`,
        `obj`.`CONTENT` AS `objectcontent`,
        `hist`.`COMMENT` AS `comment`
    from
        (((`t_learn_hist` `hist`
        left join `t_learn_obj` `obj` ON ((`hist`.`OBJECTID` = `obj`.`ID`)))
        left join `t_learn_ctg` `ctgy` ON ((`obj`.`CATEGORY` = `ctgy`.`ID`)))
        left join `t_user` `user` ON ((`hist`.`USERID` = `user`.`USERID`)));
		
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_learn_award` AS
    select 
        `t_learn_award`.`ID` AS `id`,
        `t_learn_award`.`USERID` AS `userid`,
        `t_user`.`DISPLAYAS` AS `displayas`,
        `t_learn_award`.`ADATE` AS `adate`,
        `t_learn_award`.`SCORE` AS `score`,
        `t_learn_award`.`REASON` AS `reason`
    from
        (`t_learn_award`
        left join `t_user` ON ((`t_learn_award`.`USERID` = `t_user`.`USERID`)));
		
/*======================================================
    Stored Procedures 
  ====================================================== */
-- Finance part
DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_FINANCEACCOUNT`(
	IN ctgyid int(11),
	IN accname varchar(30),
	IN acccmt varchar(45))
BEGIN
-- Declare exception handler for failed insert
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

-- Check the existence of the user	
	IF EXISTS(SELECT 1 FROM t_fin_account_ctgy WHERE ID = ctgyid) THEN
		INSERT INTO `t_fin_account`(`CTGYID`, `NAME`, `COMMENT`)
			VALUES( ctgyid, accname, acccmt);

		IF code = '00000' THEN
			GET DIAGNOSTICS rows = ROW_COUNT;
			SET msg = CONCAT('insert succeeded, row count = ',rows);
		END IF;
	ELSE
		SET msg = 'Invalid category!';
		SET code = '00001';
	END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_FINANCEACCOUNTCATEGORY`(
	IN ctgyname varchar(30),
	IN assetflag boolean,
	IN ctgycmt varchar(45)
)
BEGIN
-- Declare exception handler for failed insert
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

-- Check the name is not null
	IF ctgyname IS NOT NULL THEN
		INSERT INTO `t_fin_account_ctgy` (`NAME`,  `ASSETFLAG`, `COMMENT`)
			VALUES(ctgyname, assetflag, ctgycmt);

		IF code = '00000' THEN
			GET DIAGNOSTICS rows = ROW_COUNT;
			SET msg = CONCAT('insert succeeded, row count = ',rows);
		END IF;
	ELSE
		SET msg = 'Name is Must!';
		SET code = '00001';
	END IF;

	SELECT code, msg, LAST_INSERT_ID();
END$$

DELIMITER ;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_FINANCECONTROLCENTER`(
	IN parid INT(11),
	IN centname varchar(30),
	IN centcmt varchar(45)
)
BEGIN
-- Declare exception handler for failed insert
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

-- Check the existence of the parent
	IF (parid IS NULL) OR (parid IS NOT NULL AND EXISTS(SELECT 1 FROM t_learn_ctg WHERE id = parid)) THEN
		INSERT INTO `t_fin_controlcenter` (`NAME`, `PARID`, `COMMENT`)
			VALUES ( centname, parid, centcmt);
	ELSE
		SET msg = 'Invalid Parent ID!';
		SET code = '00001';
	END IF;

	SELECT code, msg, LAST_INSERT_ID();
END$$

DELIMITER ;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_FINANCEINTERNALORDER`(
	IN ioname varchar(30),
	IN validfrom date,
	IN validto date,
	IN iocomment varchar(45)
)
BEGIN
-- Declare exception handler for failed insert
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

-- Check the existence of the parent
	IF (length(ioname) > 0 AND valid_from IS NOT NULL AND valid_to IS NOT NULL AND valid_to > valid_from ) THEN
		INSERT INTO `t_fin_intorder` (`NAME`, `VALID_FROM`, `VALID_TO`, `COMMENT`) 
			VALUES (ioname, validfrom, validto, iocomment);
	ELSE
		SET msg = 'Invalid inputting parameter';
		SET code = '00001';
	END IF;

	SELECT code, msg, LAST_INSERT_ID();
END$$

DELIMITER ;

-- Procedure: REPORT_FIN_TT
DROP procedure IF EXISTS `REPORT_FIN_CC`;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `REPORT_FIN_CC`(IN `p_fromdate` date, IN `p_todate` date )
BEGIN

DROP temporary TABLE if exists tmp_fin_report_cc ;
DROP temporary TABLE if exists tmp_fin_report_cc1;
DROP temporary TABLE if exists tmp_fin_report_cc2;

create temporary table tmp_fin_report_cc 
select
  tab_c.controlcenterid, 
  tab_a.trantype_expense,
  round(tab_a.tranamount_lc * tab_c.precent / 100, 4) as tranamount
  from v_fin_document_item2 tab_a
	left outer join t_fin_intorder_settrule tab_c
		on tab_a.orderid = tab_c.intordid
	where tab_a.orderid is not null and tab_a.orderid != 0 
	and tab_a.trandate between p_fromdate and p_todate

union all

select
  controlcenterid as controlcenterid, 
  trantype_expense,
  round(tranamount_lc, 4) as tranamount
  from v_fin_document_item2 tab_a
	where controlcenterid is not null and controlcenterid != 0
	and trandate between p_fromdate and p_todate;

create temporary table tmp_fin_report_cc1
select 
    controlcenterid as `ccid`,
    round(sum(`tranamount`),2) AS `tranamount`
	from tmp_fin_report_cc 
	where trantype_expense = 0
	group by controlcenterid;

create temporary table tmp_fin_report_cc2
select 
    controlcenterid as `ccid`,
    round(sum(`tranamount`),2) AS `tranamount`
	from tmp_fin_report_cc 
	where trantype_expense = 1
	group by controlcenterid;

select t_fin_controlcenter.id as ccid,
	t_fin_controlcenter.name as ccname,
	t_fin_controlcenter.parid as ccparid,
	(case when cc_data.debit_tranamount is not null then cc_data.debit_tranamount else 0.0 end) as debit_tranamount,
	(case when cc_data.credit_tranamount is not null then cc_data.credit_tranamount else 0.0 end) as credit_tranamount,
	(case when cc_data.debit_tranamount is not null then cc_data.debit_tranamount else 0.0 end) - (case when cc_data.credit_tranamount is not null then cc_data.credit_tranamount else 0.0 end) as balance_tranamount
from t_fin_controlcenter
left outer join (
	select tab_a.ccid as ccid,
		tab_a.tranamount as debit_tranamount,
		tab_b.tranamount as credit_tranamount
	from tmp_fin_report_cc1 tab_a
	left outer join tmp_fin_report_cc2 tab_b
	on tab_a.ccid = tab_b.ccid ) cc_data
on t_fin_controlcenter.id = cc_data.ccid;

DROP temporary TABLE if exists tmp_fin_report_cc1 ;
DROP temporary TABLE if exists tmp_fin_report_cc2 ;
DROP temporary TABLE if exists tmp_fin_report_cc ;

END$$

DELIMITER ;

-- Procedure: REPORT_FIN_TT
DROP procedure IF EXISTS `REPORT_FIN_TT`;

DELIMITER $$
CREATE PROCEDURE `REPORT_FIN_TT` (IN p_fromdate date,
	IN p_todate date)
BEGIN

select 
	t_fin_tran_type.id,
	t_fin_tran_type.name,
	t_fin_tran_type.expense,
	t_fin_tran_type.parid,
	t_fin_tran_type.comment,
	(case when tt_data.tranamount is not null then tt_data.tranamount else 0.0 end) as tranamount
	from t_fin_tran_type
	left outer join (select
	trantype, round(sum(`tranamount_lc`), 2) AS `tranamount` 
	from 
	v_fin_document_item2
	where trandate between p_fromdate AND p_todate
	group by trantype ) tt_data
	on t_fin_tran_type.id = tt_data.trantype;

END$$
DELIMITER ;

-- Learning part
DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNAWARD`(
	IN userid varchar(25),
	IN adate date,
	IN score int(11),
	IN reason varchar(45))
proc_main:BEGIN
-- Declare exception handler for failed insert
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

-- Check the existence of the user	
	IF EXISTS(SELECT 1 FROM t_user WHERE USERID = userid) THEN
		INSERT INTO `t_learn_award` (`USERID`,`ADATE`,`SCORE`,`REASON`)
		VALUES (userid, adate, score, reason);
		IF code = '00000' THEN
			GET DIAGNOSTICS rows = ROW_COUNT;
			SET msg = CONCAT('insert succeeded, row count = ',rows);
		END IF;
	ELSE
		SET msg = 'Invalid User!';
		SET code = '00001';
	END IF;

	SELECT code, msg, LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNCATEGORY`( 
	IN parid int(11),
	IN ctgyname varchar(45),
	IN cmt varchar(150))
BEGIN
-- Declare exception handler for failed insert
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

-- Check the existence of the parent
	IF (parid IS NULL) OR (parid IS NOT NULL AND EXISTS(SELECT 1 FROM t_learn_ctg WHERE id = parid)) THEN
		INSERT INTO `t_learn_ctg` (`PARENT_ID`, `NAME`, `COMMENT`)
			VALUES (parid, ctgyname, cmt);	
	ELSE
		SET msg = 'Invalid Parent ID!';
		SET code = '00001';
	END IF;

	SELECT code, msg, LAST_INSERT_ID();
END$$
DELIMITER ;


DROP procedure IF EXISTS `CREATE_LEARNHISTORY`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNHISTORY`(
	IN userid varchar(25),
	IN objid int(11),
	IN learndate date,
	IN comt varchar(45))
proc_main:BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;

		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;

		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	IF EXISTS(SELECT 1 FROM t_user WHERE USERID = userid) AND EXISTS(SELECT 1 FROM t_learn_obj WHERE ID = objid) THEN
		IF EXISTS(SELECT 1 FROM t_learn_hist WHERE userid = userid and objectid = objid and learndate = learndate) THEN 
			SET errmsg = 'Same record exists!';
			SET errcode = '00003';
			SELECT errcode, errmsg;
			LEAVE proc_main;
		END IF;
	ELSE
		SET errmsg = 'Invalid User OR Invalid Object';
		SET errcode = '00004';
		SELECT errcode, errmsg;
		LEAVE proc_main;
	END IF;

	INSERT INTO `t_learn_hist` (`USERID`, `OBJECTID`, `LEARNDATE`, `COMMENT`) 
			VALUES (userid, objid, learndate, comt);

    SELECT errcode, errmsg;    
END$$

DELIMITER ;

DROP procedure IF EXISTS `UPDATE_LEARNHISTORY`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_LEARNHISTORY`(
	IN userid varchar(25),
	IN objid int(11),
	IN learndate date,
	IN comt varchar(45))
BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;
		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;
		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	START TRANSACTION;

	IF EXISTS(SELECT 1 FROM t_user WHERE USERID = userid) AND EXISTS(SELECT 1 FROM t_learn_obj WHERE ID = objid) THEN		
		IF NOT EXISTS(SELECT 1 FROM t_learn_hist WHERE userid = userid and objectid = objid and learndate = learndate FOR UPDATE) THEN 
			SET errmsg = 'Record not exists!';
			SET errcode = '00003';
		ELSE
			UPDATE `t_learn_hist` SET `COMMENT` = comt
				WHERE `USERID` = userid AND `OBJECTID` = objid AND `LEARNDATE` = learndate;
            COMMIT;
		END IF;
	ELSE
		SET errmsg = 'Invalid User OR Invalid Object';
		SET errcode = '00004';
	END IF;

	SELECT errcode, errmsg;
END$$

DELIMITER ;

DROP procedure IF EXISTS `DELETE_LEARNHISTORY`;

DELIMITER $$
CREATE PROCEDURE `DELETE_LEARNHISTORY` (
	IN userid varchar(25),
	IN objid int(11),
	IN learndate date)
BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;
		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;
		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	START TRANSACTION;

	IF NOT EXISTS(SELECT 1 FROM t_learn_hist WHERE userid = userid and objectid = objid and learndate = learndate FOR UPDATE) THEN 
		SET errmsg = 'Record not exists!';
		SET errcode = '00003';
	ELSE
		DELETE FROM `t_learn_hist`
			WHERE `USERID` = userid AND `OBJECTID` = objid AND `LEARNDATE` = learndate;	
        COMMIT;		
	END IF;

	SELECT errcode, errmsg;
END$$

DELIMITER ;


DROP procedure IF EXISTS `CREATE_LEARNOBJECT`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNOBJECT`(IN CTGYID int(11), IN OBJNAME nvarchar(45), IN OBJCONTENT text)
proc_main:BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;
	DECLARE errid INT(11) DEFAULT -1;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;

		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg, errid;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;

		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg, errid;
	END;

	IF EXISTS (SELECT 1 FROM t_learn_ctg  WHERE ID = CTGYID) AND OBJNAME IS NOT NULL AND LENGTH(OBJNAME) > 0 AND OBJCONTENT IS NOT NULL AND LENGTH(OBJCONTENT) > 0 then
		INSERT INTO `t_learn_obj` (`CATEGORY`, `NAME`, `CONTENT`)
			VALUES (CTGYID,  OBJNAME, OBJCONTENT);
	ELSE 
		SET errmsg = 'Invalid Category, Invalid Object Name or Invalid Object Content';
		SET errcode = '00003';
		SELECT errcode, errmsg, errid;
		LEAVE proc_main;
	END IF;
	
	SELECT errcode, errmsg, LAST_INSERT_ID();
END$$

DELIMITER ;

DROP procedure IF EXISTS `UPDATE_LEARNOBJECT`;

DELIMITER $$
CREATE PROCEDURE `UPDATE_LEARNOBJECT` (IN OBJID int(11), IN CTGYID int(11), IN OBJNAME nvarchar(45), IN OBJCONTENT text)
BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;
		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;
		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	START TRANSACTION;

-- Check the existence of the user	
	IF EXISTS (SELECT 1 FROM `t_learn_ctg` WHERE ID = CTGYID) AND OBJNAME IS NOT NULL AND LENGTH(OBJNAME) > 0 AND OBJCONTENT IS NOT NULL AND LENGTH(OBJCONTENT) > 0 then
		IF EXISTS(SELECT 1 FROM `t_learn_obj` WHERE ID = OBJID FOR UPDATE) THEN 
			UPDATE `t_learn_obj` SET `CATEGORY` = CTGYID, `NAME` = OBJNAME, `CONTENT` = OBJCONTENT
				WHERE `ID` = OBJID;
            COMMIT;
		ELSE
			SET errmsg = 'Record not exists!';
			SET errcode = '00003';
		END IF;
	ELSE
		SET errmsg = 'Invalid inputting parameters';
		SET errcode = '00004';
	END IF;

	SELECT errcode, errmsg;

END$$

DELIMITER ;

DROP procedure IF EXISTS `DELETE_LEARNOBJECT`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DELETE_LEARNOBJECT`(IN OBJID INT(11))
BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;
		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;
		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	START TRANSACTION;

-- Check the existence of the user	
	IF EXISTS(SELECT 1 FROM `t_learn_hist` WHERE OBJECTID = OBJID) OR EXISTS(select 1 FROM `t_learn_plandtl` WHERE OBJECTID = OBJID) THEN
		SET errmsg = 'Record still in use!';
		SET errcode = '00004';
	ELSE
		IF EXISTS(SELECT 1 FROM `t_learn_obj` WHERE ID = OBJID FOR UPDATE) THEN 
			DELETE FROM `t_learn_obj` WHERE `ID` = OBJID;
			COMMIT;
		ELSE
			SET errmsg = 'Record not exists!';
			SET errcode = '00003';
		END IF;
	END IF;

	SELECT errcode, errmsg;

END$$

DELIMITER ;

DROP procedure IF EXISTS `CREATE_LEARNPLAN`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNPLAN`(IN PLANNAME nvarchar(45), IN PLANCOMMENT nvarchar(45))
proc_main:BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;
	DECLARE errid INT(11) DEFAULT -1;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;

		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg, errid;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;

		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg, errid;
	END;

	IF PLANNAME IS NOT NULL AND LENGTH(PLANNAME) > 0 then
		INSERT INTO `t_learn_plan` (`NAME`, `CONTENT`)
			VALUES (PLANNAME, PLANCONTENT);
	ELSE 
		SET errmsg = 'Invalid inputting parameter';
		SET errcode = '00003';
		SELECT errcode, errmsg, errid;
		LEAVE proc_main;
	END IF;
	
	SELECT errcode, errmsg, LAST_INSERT_ID();
END$$

DELIMITER ;

DROP procedure IF EXISTS `UPDATE_LEARNPLAN`;

DELIMITER $$
CREATE PROCEDURE `UPDATE_LEARNPLAN` (IN PLANID int(11), 
	IN PLANNAME nvarchar(45), 
	IN PLANCOMMENT nvarchar(45))
BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;
		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;
		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	IF PLANID IS NOT NULL AND PLANNAME IS NOT NULL AND LENGTH(PLANNAME) > 0 then
		IF EXISTS(SELECT 1 FROM `t_learn_plan` WHERE ID = PLANID FOR UPDATE) THEN 
			UPDATE `t_learn_plan` SET `NAME` = PLANNAME, `COMMENT` = PLANCOMMENT
				WHERE `ID` = PLANID;
		ELSE
			SET errmsg = 'Record not exists!';
			SET errcode = '00003';
		END IF;
	ELSE
		SET errmsg = 'Invalid inputting parameters';
		SET errcode = '00004';
	END IF;

	SELECT errcode, errmsg;

END$$

DELIMITER ;

DROP procedure IF EXISTS `DELETE_LEARNPLAN`;

DELIMITER $$
CREATE PROCEDURE `DELETE_LEARNPLAN` (IN PLANID int(11))
BEGIN
-- Declare exception handler for failed insert
	DECLARE errcode CHAR(5) DEFAULT '00000';
	DECLARE errmsg TEXT DEFAULT NULL;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- ERROR!
		ROLLBACK;
		SET errcode = '0001';
		SET errmsg = 'SQL Exception occurred!';
		SELECT errcode, errmsg;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING 
	BEGIN
		-- WARNING!
		ROLLBACK;
		SET errcode = '0002';
		SET errmsg = 'SQL Warning occurred!';
		SELECT errcode, errmsg;
	END;

	START TRANSACTION;

	IF EXISTS(SELECT 1 FROM `t_learn_plan` WHERE ID = PLANID FOR UPDATE) THEN 
		DELETE FROM `t_learn_plan` WHERE `ID` = PLANID;
		DELETE FROM `t_learn_plandtl` WHERE `ID` = PLANID;

		COMMIT;
	ELSE
		SET errmsg = 'Record not exists!';
		SET errcode = '00003';
	END IF;

	SELECT errcode, errmsg;
END$$

DELIMITER ;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_USER_HIST`(IN `iv_user` VARCHAR(50), IN `iv_type` TINYINT, IN `iv_others` VARCHAR(50))
BEGIN

DECLARE nextseq INT(11) DEFAULT 0;

select max(`SEQNO`) INTO nextseq FROM t_user_hist WHERE `USERID` = iv_user;

IF nextseq IS NULL OR nextseq = 0 THEN
	SET nextseq = 1;
ELSE
	SET nextseq = nextseq + 1;
END IF;

INSERT INTO t_user_hist (`USERID`, `SEQNO`, `HISTTYP`, `OTHERS`)
		VALUES (iv_user, nextseq, iv_type, iv_others);

END$$

DELIMITER ;

/*======================================================
    Triggers 
  ====================================================== */
DELIMITER $$
DROP TRIGGER IF EXISTS t_learn_hist_BINS$$
CREATE TRIGGER `t_learn_hist_BINS` BEFORE INSERT ON `t_learn_hist` FOR EACH ROW BEGIN
if ( isnull(new.LEARNDATE) ) then
 set new.LEARNDATE=curdate();
end if;
END
$$
DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS t_user_hist_BINS$$  
CREATE TRIGGER `t_user_hist_BINS` BEFORE INSERT ON `t_user_hist` FOR EACH ROW BEGIN
if ( isnull(new.TIMEPOINT) ) then
 set new.TIMEPOINT=now();
end if;
END
$$
DELIMITER ;
