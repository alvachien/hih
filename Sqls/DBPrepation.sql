/* 
 * SQL file for preparing HIH running on MySql/MadriaDB
 * Version: 0.5
 * Created: 2015/05/16
 * (C) Copyright by Alva Chien, 2014 - 2015
 *
 * == Version Histories
 *  1. 2015.9.8, adding table t_fin_setting ;
 *  2. 2015.9.11, changing the logic for foreign currency part;
 *  3. 2015.9.15, changing the tables and views for foreign currency support;
 */

/*======================================================
    Tables 
  ====================================================== */

-- Table Creation: Finance part
CREATE TABLE IF NOT EXISTS `t_fin_account` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CTGYID` int(11) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Account';

CREATE TABLE IF NOT EXISTS `t_fin_account_ctgy` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `ASSETFLAG` tinyint(4) NOT NULL DEFAULT '1',
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='Account Category';

CREATE TABLE IF NOT EXISTS `t_fin_controlcenter` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `PARID` int(11) DEFAULT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='Cost Center';

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='Document Type';

CREATE TABLE IF NOT EXISTS `t_fin_document` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DOCTYPE` smallint(6) NOT NULL,
  `TRANDATE` date NOT NULL,
  `TRANCURR` varchar(5) NOT NULL,
  `DESP` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Document';

CREATE TABLE IF NOT EXISTS `t_fin_document_item` (
  `DOCID` int(11) NOT NULL,
  `ITEMID` int(11) NOT NULL,
  `ACCOUNTID` int(11) NOT NULL,
  `TRANTYPE` smallint(6) NOT NULL,
  `TRANAMOUNT` double NOT NULL,
  `CONTROLCENTERID` int(11) DEFAULT NULL,
  `ORDERID` int(11) DEFAULT NULL,
  `DESP` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`DOCID`,`ITEMID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Document Item';

CREATE TABLE IF NOT EXISTS `t_fin_intorder` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `VALID_FROM` date NOT NULL,
  `VALID_TO` date NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Internal Order';

CREATE TABLE IF NOT EXISTS `t_fin_intorder_settrule` (
  `INTORDID` int(11) NOT NULL,
  `RULEID` int(11) NOT NULL,
  `CONTROLCENTERID` int(11) NOT NULL,
  `PRECENT` int(11) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`INTORDID`,`RULEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Settlement Rule of Internal Order';

CREATE TABLE IF NOT EXISTS `t_fin_tran_type` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(30) NOT NULL,
  `EXPENSE` tinyint(4) NOT NULL DEFAULT '0',
  `PARID` smallint(6) DEFAULT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COMMENT='Transaction Type';

-- Table Creation: Learning part
CREATE TABLE IF NOT EXISTS `t_learn_award` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `USERID` varchar(25) NOT NULL,
  `ADATE` date NOT NULL,
  `SCORE` int(11) NOT NULL,
  `REASON` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COMMENT='Learn award';

CREATE TABLE IF NOT EXISTS `t_learn_ctg` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PARENT_ID` int(11) DEFAULT NULL,
  `NAME` varchar(45) NOT NULL,
  `COMMENT` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COMMENT='Learn category';

CREATE TABLE IF NOT EXISTS `t_learn_hist` (
  `USERID` varchar(25) NOT NULL,
  `OBJECTID` int(11) NOT NULL,
  `LEARNDATE` date NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`USERID`,`OBJECTID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Learning history';

CREATE TABLE IF NOT EXISTS `t_learn_obj` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CATEGORY` int(11) DEFAULT NULL,
  `NAME` varchar(45) DEFAULT NULL,
  `CONTENT` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COMMENT='Learn Object';

-- User part
CREATE TABLE IF NOT EXISTS `t_user` (
  `USERID` varchar(25) NOT NULL,
  `DISPLAYAS` varchar(50) NOT NULL,
  `PASSWORD` varchar(150) NOT NULL,
  `CREATEDON` datetime NOT NULL,
  `GENDER` tinyint(4) DEFAULT '0',
  `EMAIL` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`USERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User';

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
        (case
            when (`t_fin_tran_type`.`EXPENSE` = 1) then (`t_fin_document_item`.`TRANAMOUNT` * -(1))
            when (`t_fin_tran_type`.`EXPENSE` = 0) then `t_fin_document_item`.`TRANAMOUNT`
        end) AS `tranamount`,
        `t_fin_document_item`.`CONTROLCENTERID` AS `CONTROLCENTERID`,
        `t_fin_controlcenter`.`NAME` AS `CONTROLCENTERNAME`,
        `t_fin_document_item`.`ORDERID` AS `ORDERID`,
        `t_fin_intorder`.`NAME` AS `ordername`,
        `t_fin_document_item`.`DESP` AS `desp`,
        `t_fin_tran_type`.`NAME` AS `trantype_name`,
        `t_fin_tran_type`.`EXPENSE` AS `trantype_expense`
    from
        (((`t_fin_document_item`
        left join `t_fin_tran_type` ON ((`t_fin_document_item`.`TRANTYPE` = `t_fin_tran_type`.`ID`)))
        left join `t_fin_controlcenter` ON ((`t_fin_document_item`.`CONTROLCENTERID` = `t_fin_controlcenter`.`ID`)))
        left join `t_fin_intorder` ON ((`t_fin_document_item`.`ORDERID` = `t_fin_intorder`.`ID`)));
	
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document` AS
    select 
        `t_fin_document`.`ID` AS `id`,
        `t_fin_document`.`DOCTYPE` AS `doctype`,
        `t_fin_doc_type`.`NAME` AS `doctype_name`,
        `t_fin_document`.`TRANDATE` AS `trandate`,
        `t_fin_document`.`TRANCURR` AS `trancurr`,
        `t_fin_currency`.`NAME` AS `trancurr_name`,
        `t_fin_document`.`DESP` AS `desp`,
        sum(`v_fin_document_item1`.`tranamount`) AS `tranamount`
    from
        (((`t_fin_document`
        left join `v_fin_document_item1` ON ((`t_fin_document`.`ID` = `v_fin_document_item1`.`docid`)))
        join `t_fin_doc_type` ON ((`t_fin_document`.`DOCTYPE` = `t_fin_doc_type`.`ID`)))
        join `t_fin_currency` ON ((`t_fin_document`.`TRANCURR` = `t_fin_currency`.`CURR`)))
    group by `t_fin_document`.`ID`;
	
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document_item2` AS
    select 
        `tab_a`.`docid` AS `docid`,
        `tab_a`.`itemid` AS `itemid`,
        `tab_a`.`accountid` AS `accountid`,
        `tab_b`.`NAME` AS `accountname`,
        `tab_a`.`trantype` AS `trantype`,
        `tab_a`.`trantype_name` AS `trantype_name`,
        `tab_a`.`tranamount` AS `tranamount`,
        `tab_a`.`CONTROLCENTERID` AS `controlcenterid`,
        `tab_a`.`CONTROLCENTERNAME` AS `controlcentername`,
        `tab_a`.`ORDERID` AS `orderid`,
        `tab_a`.`ordername` AS `ordername`,
        `tab_a`.`desp` AS `desp`,
        `tab_a`.`trantype_expense` AS `trantype_expense`,
        `tab_b`.`CTGYID` AS `accountcategory`
    from
        (`v_fin_document_item1` `tab_a`
        left join `t_fin_account` `tab_b` ON ((`tab_a`.`accountid` = `tab_b`.`ID`)));
		
CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_fin_document_item3` AS
    select 
        `tab_a`.`docid` AS `docid`,
        `tab_a`.`itemid` AS `itemid`,
        `tab_a`.`accountid` AS `accountid`,
        `tab_b`.`NAME` AS `accountname`,
        `tab_a`.`trantype` AS `trantype`,
        `tab_a`.`trantype_name` AS `trantype_name`,
        `tab_a`.`tranamount` AS `tranamount`,
        `tab_a`.`controlcenterid` AS `controlcenterid`,
        `tab_a`.`controlcentername` AS `controlcentername`,
        `tab_a`.`orderid` AS `orderid`,
        `tab_a`.`ordername` AS `ordername`,
        `tab_a`.`desp` AS `desp`,
        `tab_a`.`trantype_expense` AS `trantype_expense`,
        `tab_b`.`ID` AS `accountcategory`,
        `tab_b`.`NAME` AS `accountcategoryname`,
        `tab_c`.`DOCTYPE` AS `doctype`,
        `tab_d`.`NAME` AS `doctypename`,
        `tab_c`.`TRANDATE` AS `trandate`,
        `tab_c`.`TRANCURR` AS `trancurr`,
        `tab_e`.`NAME` AS `trancurrname`
    from
        ((((`v_fin_document_item2` `tab_a`
        join `t_fin_account_ctgy` `tab_b` ON ((`tab_a`.`accountcategory` = `tab_b`.`ID`)))
        join `t_fin_document` `tab_c` ON ((`tab_a`.`docid` = `tab_c`.`ID`)))
        join `t_fin_doc_type` `tab_d` ON ((`tab_c`.`DOCTYPE` = `tab_d`.`ID`)))
        join `t_fin_currency` `tab_e` ON ((`tab_c`.`TRANCURR` = `tab_e`.`CURR`)));
		
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

-- Learing part		
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
END;

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

END;

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

END;

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

END;

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
END;

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
END;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNHISTORY`(
	IN userid varchar(25),
	IN objid int(11),
	IN learndate date,
	IN comt varchar(45))
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
	IF EXISTS(SELECT 1 FROM t_user WHERE USERID = userid) AND EXISTS(SELECT 1 FROM t_learn_obj WHERE ID = objid) THEN
		IF EXISTS(SELECT 1 FROM t_learn_hist WHERE userid = userid and objectid = objid) THEN 
			SET msg = 'Same record exists!';
			SET code = '00002';
			SELECT code, msg;
			LEAVE proc_main;
		END IF;
	ELSE
		SET msg = 'Invalid User OR Invalid Object';
		SET code = '00001';
		SELECT code, msg;
		LEAVE proc_main;
	END IF;

	INSERT INTO `t_learn_hist` (`USERID`, `OBJECTID`, `LEARNDATE`, `COMMENT`) 
			VALUES (userid, objid, learndate, comt);
	IF code = '00000' THEN
		GET DIAGNOSTICS rows = ROW_COUNT;
		SET msg = CONCAT('insert succeeded, row count = ',rows);
	END IF;

	SELECT code, msg;
END;

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CREATE_LEARNOBJECT`(IN CTGYID int(11), IN OBJNAME nvarchar(45), IN OBJCONTENT text)
proc_main:BEGIN
	DECLARE code CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
	DECLARE rows INT;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      GET DIAGNOSTICS CONDITION 1
        code = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
    END;

	IF EXISTS (SELECT 1 FROM t_learn_ctg  WHERE ID = CTGYID) AND OBJNAME IS NOT NULL AND LENGTH(OBJNAME) > 0 AND OBJCONTENT IS NOT NULL AND LENGTH(OBJCONTENT) > 0 then
		INSERT INTO `t_learn_obj` (`CATEGORY`, `NAME`, `CONTENT`)
		VALUES (CTGYID,  OBJNAME, OBJCONTENT);
	ELSE 
		SET msg = 'Invalid Category, Invalid Object Name or  Invalid Object Content';
		SET code = '00001';
		SELECT code, msg;
		LEAVE proc_main;
	END IF;
	
	SELECT code, msg, LAST_INSERT_ID();
END;

/*======================================================
    Pre-delivered content 
  ====================================================== */

--Finance part
-- Account categoryINSERT INTO `t_fin_account_ctgy` (`ID`,`NAME`,`ASSETFLAG`,`COMMENT`) VALUES (1,'现金',1,NULL);
INSERT INTO `t_fin_account_ctgy` (`ID`,`NAME`,`ASSETFLAG`,`COMMENT`) VALUES (2,'存储卡',1,NULL);
INSERT INTO `t_fin_account_ctgy` (`ID`,`NAME`,`ASSETFLAG`,`COMMENT`) VALUES (3,'信用卡',1,NULL);
INSERT INTO `t_fin_account_ctgy` (`ID`,`NAME`,`ASSETFLAG`,`COMMENT`) VALUES (4,'应付账款',0,'如贷款等');
INSERT INTO `t_fin_account_ctgy` (`ID`,`NAME`,`ASSETFLAG`,`COMMENT`) VALUES (5,'应收账款',1,NULL);
INSERT INTO `t_fin_account_ctgy` (`ID`,`NAME`,`ASSETFLAG`,`COMMENT`) VALUES (6,'金融账户',1,'支付宝等');

-- Currency
INSERT INTO `t_fin_currency` (`CURR`,`NAME`,`Symbo`) VALUES ('CNY','人民币',NULL);
INSERT INTO `t_fin_currency` (`CURR`,`NAME`,`Symbo`) VALUES ('EUR','欧元',NULL);
INSERT INTO `t_fin_currency` (`CURR`,`NAME`,`Symbo`) VALUES ('HKD','港币',NULL);
INSERT INTO `t_fin_currency` (`CURR`,`NAME`,`Symbo`) VALUES ('JPY','日币',NULL);
INSERT INTO `t_fin_currency` (`CURR`,`NAME`,`Symbo`) VALUES ('TWD','新台币',NULL);
INSERT INTO `t_fin_currency` (`CURR`,`NAME`,`Symbo`) VALUES ('USD','美元',NULL);

-- Document type
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (1,'普通收支','普通');
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (2,'转账',NULL);

-- Transaction TYPE
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (2,'主业收入',0,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (3,'工资',0,2,'工资');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (4,'奖金',0,2,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (5,'投资类收入',0,NULL,'投资类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (6,'股票收益',0,5,'股票收益');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (7,'基金收益',0,5,'基金类收益');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (8,'利息收入',0,5,'银行利息收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (9,'生活类开支',1,NULL,'生活类开支');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (10,'其它收入',0,NULL,'其它收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (11,'物业类支出',1,9,'物业类支出');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (12,'私家车支出',1,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (13,'彩票奖金',0,10,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (14,'小区物业费',1,11,'小区的物业费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (15,'水费',1,11,'水费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (16,'电费',1,11,'电费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (17,'天然气费',1,11,'天然气费用');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (18,'物业维修费',1,11,'物业维修费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (19,'车辆保养',1,12,'保养');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (20,'汽油费',1,12,'汽车加油');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (21,'车辆保险费',1,12,'保险');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (22,'停车费',1,12,'停车费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (23,'车辆维修',1,12,'车辆维修');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (24,'其它支出',1,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (25,'保险类',1,NULL,'保险类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (26,'通讯费',1,9,'通讯费用');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (27,'固定电话/宽带',1,26,'固定电话和宽带');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (28,'手机费',1,26,'手机、流量等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (29,'彩票支出',1,24,'彩票');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (2,'主业收入',0,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (3,'工资',0,2,'工资');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (4,'奖金',0,2,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (5,'投资类收入',0,NULL,'投资类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (6,'股票收益',0,5,'股票收益');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (7,'基金收益',0,5,'基金类收益');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (8,'利息收入',0,5,'银行利息收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (9,'生活类开支',1,NULL,'生活类开支');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (10,'其它收入',0,NULL,'其它收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (11,'物业类支出',1,9,'物业类支出');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (12,'私家车支出',1,9,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (13,'彩票奖金',0,10,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (14,'小区物业费',1,11,'小区的物业费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (15,'水费',1,11,'水费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (16,'电费',1,11,'电费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (17,'天然气费',1,11,'天然气费用');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (18,'物业维修费',1,11,'物业维修费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (19,'车辆保养',1,12,'保养');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (20,'汽油费',1,12,'汽车加油');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (21,'车辆保险费',1,12,'保险');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (22,'停车费',1,12,'停车费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (23,'车辆维修',1,12,'车辆维修');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (24,'其它支出',1,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (25,'银行保险类',1,NULL,'保险类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (26,'通讯费',1,9,'通讯费用');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (27,'固定电话/宽带',1,26,'固定电话和宽带');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (28,'手机费',1,26,'手机、流量等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (29,'彩票支出',1,24,'彩票');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (30,'人情交往类',0,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (31,'人际交往',1,NULL,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (32,'红包支出',1,31,'红包支出');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (33,'红包收入',0,30,'红包收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (34,'保单缴费',1,25,'保险保单缴费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (35,'津贴',0,2,'津贴类，如加班等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (36,'保险报销收入',0,5,'保险报销收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (37,'转账收入',0,10,'转账收入');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (38,'衣服饰品',1,9,'衣服饰品等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (39,'食品酒水',1,9,'食品酒水类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (40,'衣服鞋帽',1,38,'衣服鞋帽');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (41,'化妆饰品',1,38,'化妆品等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (42,'水果类',1,39,'水果');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (43,'零食类',1,39,'零食类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (44,'烟酒茶类',1,39,'烟酒茶等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (45,'咖啡外卖类',1,39,'咖啡与快餐');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (46,'早中晚餐',1,39,'正餐类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (47,'请客送礼',1,31,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (48,'孝敬家长',1,31,NULL);
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (49,'休闲娱乐',1,9,'休闲娱乐类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (50,'旅游度假',1,49,'旅游度假');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (51,'电影演出',1,49,'看电影，看演出等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (52,'摄影外拍类',1,49,'摄影外拍');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (53,'腐败聚会类',1,49,'KTV之类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (54,'学习进修',1,9,'学习进修');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (55,'银行利息',1,25,'银行利息');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (56,'银行手续费',1,25,'银行手续费');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (57,'违章付款类',1,12,'违章付款等');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (58,'书刊杂志',1,54,'书刊和杂志');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (59,'培训进修',1,54,'培训进修类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (60,'转账支出',1,24,'转账');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (61,'日常用品',1,9,'日常用品');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (62,'日用品',1,61,'日用品类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (63,'电子产品类',1,61,'电子产品类');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (64,'厨房用具',1,61,'厨房用具');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (65,'洗涤用品',1,61,'洗涤用品');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (66,'大家电类',1,61,'大家电');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (67,'保健护理用品',1,61,'保健护理');
INSERT INTO `t_fin_tran_type` (`ID`,`NAME`,`EXPENSE`,`PARID`,`COMMENT`) VALUES (68,'喂哺用品',1,61,NULL);

-- Learning part
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (1,NULL,'语文','语文');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (2,1,'诗词','唐诗宋词等');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (3,1,'识字','拼音认读和笔画等');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (4,1,'文言文','文言文等');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (5,1,'古典名著','古典名著等');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (6,NULL,'数学','数学类');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (7,6,'算术','加减法');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (8,6,'代数','代数');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (9,6,'几何','几何类');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (10,NULL,'英语','英语类');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (11,10,'词汇','英语词汇');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (12,10,'语法','英语语法');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (13,NULL,'日语','日语类');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (14,13,'词汇','日语词汇');
INSERT INTO `t_learn_ctg` (`ID`,`PARENT_ID`,`NAME`,`COMMENT`) VALUES (15,13,'语法','日语语法');

/*======================================================
    Delta parts on 2015.9.8
  ====================================================== */

-- Table: Setting for Finance
CREATE TABLE IF NOT EXISTS `t_fin_setting` (
  `SETID` varchar(20) NOT NULL,
  `SETVALUE` varchar(80) NOT NULL,
  `COMMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`SETID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Finance Setting';

-- Default content for setting
INSERT INTO `t_fin_setting` (`SETID`,`SETVALUE`,`COMMENT`) VALUES ('LocalCurrency','CNY','本币');
-- Default content for document type
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (3,'货币兑换', '兑换不同的货币');
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (4,'分期付款', '分期付款');
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (5,'预付款', '预付款');
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (6,'预收款', '预收款');
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (7,'借入款', '借入款项');
INSERT INTO `t_fin_doc_type` (`ID`,`NAME`,`COMMENT`) VALUES (8,'借出款', '借出款项');

-- ALTER TABLE for document
ALTER TABLE `t_fin_document` 
ADD COLUMN `TRANTGTCURR` VARCHAR(5) NULL AFTER `DESP`,
ADD COLUMN `REFCUREXGDOC` INT(11) NULL AFTER `TRANTGTCURR`;

/* ======================================================
    Delta parts on 2015.9.9
   ====================================================== */

-- Table change: document
ALTER TABLE `t_fin_document`
DROP COLUMN `TRANTGTCURR`;

-- Table change: document item
ALTER TABLE `t_fin_document_item` 
ADD COLUMN `TRANCURR` VARCHAR(5) NULL AFTER `TRANTYPE`;

/* ======================================================
    Delta parts on 2015.9.11
   ====================================================== */

-- Change tables
ALTER TABLE `t_fin_document` 
ADD COLUMN `EXGRATE` DOUBLE NULL DEFAULT NULL AFTER `REFCUREXGDOC`,
ADD COLUMN `EXGRATE_PLAN` DOUBLE NULL DEFAULT NULL AFTER `EXGRATE`;


--ALTER TABLE `t_fin_exrate` 
--ADD COLUMN `refdocid` INT(11) NULL AFTER `rate`;

-- Replace view for document
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
        `t_fin_document`.`REFCUREXGDOC` AS `curexgdoc`,        
        `t_fin_document`.`DESP` AS `desp`,
        `t_fin_document`.`EXGRATE` AS `exgrate`,
        `t_fin_document`.`EXGRATE_PLAN` AS `exgrate_plan`,
        sum(`v_fin_document_item1`.`tranamount`) AS `tranamount`
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
        `t_fin_document`.`REFCUREXGDOC` AS `curexgdoc`,        
        `t_fin_document`.`DESP` AS `desp`,
        `t_fin_document`.`EXGRATE` AS `exgrate`,
        `t_fin_document`.`EXGRATE_PLAN` AS `exgrate_plan`,
        0 AS `tranamount`
    from
        `t_fin_document`
    where `t_fin_document`.`DOCTYPE` = 3 OR `t_fin_document`.`DOCTYPE` = 2;

/* ======================================================
    Delta parts on 2015.9.14
   ====================================================== */

-- View redefinition: v_fin_document_item1 
-- Overwritted by the version on 2015.9.15 

-- View redefinition: v_fin_document
-- Overwritted by the version on 2015.9.15

-- Drop unnecessary Views;
DROP VIEW v_fin_document_item3;
DROP VIEW v_fin_document_item2;

/* ======================================================
    Delta parts on 2015.9.15
   ====================================================== */

-- Must ensure all documents with document type 3 have been deleted!

-- Add the foreign currency exchange another foreign currency support on header.
ALTER TABLE `t_fin_document` 
DROP COLUMN `REFCUREXGDOC`,
CHANGE COLUMN `EXGRATE_PLAN` `EXGRATE_PLAN` TINYINT NULL DEFAULT NULL ,
ADD COLUMN `TRANCURR2` VARCHAR(5) NULL DEFAULT NULL AFTER `EXGRATE_PLAN`,
ADD COLUMN `EXGRATE2` DOUBLE NULL DEFAULT NULL AFTER `TRANCURR2`,
ADD COLUMN `EXGRATE_PLAN2` TINYINT NULL DEFAULT NULL AFTER `EXGRATE2`;

-- Change the explicit currency information from item.
ALTER TABLE `t_fin_document_item` 
DROP COLUMN `TRANCURR`,
ADD COLUMN `USECURR2` TINYINT NULL DEFAULT NULL AFTER `TRANAMOUNT`;

-- Adjust the item view for the new table defintion. 
-- And all the report views

-- View redefinition: v_fin_document_item1
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

-- View redefinition: v_fin_document
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

/* ======================================================
    Delta parts on 2015.9.16
   ====================================================== */
   
-- redefinition view v_fin_document_item1
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
        
/* ======================================================
    Delta parts on 2015.9.25
   ====================================================== */
   
-- Create table for Exchange Rate
CREATE TABLE IF NOT EXISTS `t_fin_exrate` (
  `TRANDATE` date NOT NULL,
  `CURR` varchar(5) NOT NULL,
  `RATE` DOUBLE DEFAULT NULL,
  `REFDOCID` INT(11) DEFAULT NULL,
  PRIMARY KEY (`TRANDATE`, `CURR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Finance Exg. Rate';



/* The End */ 

