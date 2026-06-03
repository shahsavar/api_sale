--------------------- استرداد

USE [Sale]
GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspGetEsterdadExtraData]'))
    drop view sale.[uspGetEsterdadExtraData]

GO
CREATE procedure [sale].[uspGetEsterdadExtraData]

-- @Code as int,
  @IDSaleProjects as int
 ,@IdEsterdad as int


AS
        declare @Date as Varchar(10),@CountEsterdad AS INT,@CountEsterdadDirkard AS INT,@SumCoefficientPayment AS DECIMAL(5,2),@SumMaxDaySoudEsterdad  AS DECIMAL(5,2)
        ,@SumCoefficientPaymentDirkard AS DECIMAL(5,2),@EsterdadDelay AS int
        
        set @Date=dbo.Shamsi(GetDate(), 1)

		--select * from VBaseRespon where Code=@Code
		
		select @EsterdadDelay=EsterdadDelay from TSanadInfo 
		Select @CountEsterdad=Count(*)  from TEsterdadSoudBase where idlemCalculate=1 and idsaleProject=@IDSaleProjects and (ExpireDate='' or ExpireDate>=@Date)	
	    Select @SumCoefficientPayment=Sum(CoefficientPayment) ,@SumMaxDaySoudEsterdad= sum(MaxDaySoudEsterdad)  from TEsterdadSoudBase where idlemCalculate=1 and idsaleProject=@IDSaleProjects and (ExpireDate='' or ExpireDate>=@Date)
		Select @CountEsterdadDirkard=Count(*) ,  @SumCoefficientPaymentDirkard=Sum(CoefficientPayment) from TEsterdadSoudBase where idlemCalculate=2 and idsaleProject=@IDSaleProjects and (ExpireDate='' or ExpireDate>=@Date)
		
		--0
		select * from VHazineBase where IdSaleProject=@IDSaleProjects and CodeHazineName ='09'  and  (EffectiveDate<=@Date)
		
		--1
		SELECT CASE WHEN  ISNULL(@CountEsterdad,0)>0 THEN 1 ELSE 0 end AS EsterdadStatus,CASE WHEN  ISNULL(@CountEsterdadDirkard,0)>0 THEN 1 ELSE 0 end AS EsterdadDirkardStatus,
		ISNULL(@SumCoefficientPayment,0) AS SumCoefficientPayment,ISNULL(@SumMaxDaySoudEsterdad,0) AS SumMaxDaySoudEsterdad ,ISNULL(@SumCoefficientPaymentDirkard,0) AS SumCoefficientPaymentDirkard,ISNULL(@EsterdadDelay,0) AS EsterdadDelay

		--2
		SELECT ID as [value] , Title as [label]  FROM [dbo].[TEllatEsterdad]


		
		if(@IdEsterdad <> 0)

		begin
		declare @LetterNoSoud as Varchar(15) , @LetterDateSoud as varchar(10) , @LetterNoSoudDirkard as varchar(15) , @LetterDateSoudDirkard as varchar(10)
		--3
		Select * from TEsterdadInfoZarib where IdEsterdad=@IdEsterdad and TypeId in (1,2,3)

		--4
		select  @LetterNoSoud=LetterNo, @LetterDateSoud=LetterDate from [Sale].[dbo].[TEsterdadInfoZarib]  where IdEsterdad=@IdEsterdad and TypeId=2
		select  @LetterNoSoudDirkard=LetterNo, @LetterDateSoudDirkard=LetterDate from [Sale].[dbo].[TEsterdadInfoZarib]  where IdEsterdad=@IdEsterdad and TypeId=3
		SELECT ISNULL(@LetterNoSoud ,'') as LetterNoSoud , isnull(@LetterDateSoud , '') as LetterDateSoud , isnull(@LetterNoSoudDirkard , '') as LetterNoSoudDirkard , 
		isnull(@LetterDateSoudDirkard , '') as LetterDateSoudDirkard
		
		--5
		select * from VResponPayUsedEsterdadMandeRespon where idEsterdad=@IdEsterdad
		end

        ---------------------------------------------------
        ---------------------------------------------------
        GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspEsterdadResponInsert]'))
    drop view sale.[uspEsterdadResponInsert]

GO
CREATE Procedure [sale].[uspEsterdadResponInsert]

@ID as int,
@IDRespon as int,
@OrderDate AS VARCHAR(10),
@Quantity AS INT,
@HazineDefault AS INT,
@Hazine AS INT,
@IdHazineBase AS INT,
@idRelatCustomerWithAccount AS INT=0,
@EsterdadDelay AS INT=0,
@MojavezSoudDirKard AS TINYINT=0,
@LetterNo AS VARCHAR(15),
@LetterDate AS VARCHAR(10),
@LetterNoSoud AS VARCHAR(15),
@LetterDateSoud AS VARCHAR(10),
@LetterNoSoudDirkard AS VARCHAR(15),
@LetterDateSoudDirkard AS VARCHAR(10),
@ZaribSoud AS  FLOAT,
@ZaribSoudDirkard AS FLOAT,
@CalcDate VARCHAR(10),
@MaxDaySoudEsterdad INT,
@TypeCalcDate TINYINT,
@EllatId INT,
@UserID AS VARCHAR(10),
@ComputerName AS VARCHAR(50),
@msgRet AS VARCHAR(100) OUTPUT

AS
DECLARE @Date AS VARCHAR(20) ,  @idCustomer AS INT, @MandeRespon AS INT , @ResponCode AS INT ,  @HaveAccounting AS INT , @idCustomer1 AS INT , @idCustomer2 AS INT,@Code as varchar(20),
@preQuantity as int=0

SET @Date=dbo.Shamsi(GETDATE(),0)


SELECT  @MandeRespon=Mande,@IdCustomer=IDOwnerCustomer,@ResponCode=Code , @HaveAccounting=HaveAccounting
  FROM dbo.VBaseRespon WHERE id=@IDRespon
  
----------------------- TestData
 IF(@MandeRespon <= 0)
 BEGIN
 SET @msgRet = 'مانده تعهد صفر می باشد و امکان استرداد وجود ندارد'
 RETURN
 END
 


 IF EXISTS (SELECT idMoarefiName FROM dbo.TMoarefiName WHERE IdRespon=@IDRespon AND Flag<>0)
 BEGIN
 SET @msgRet = 'به دلیل وجود معرفی نامه جهت استفاده از وام تسهیلات امکان استرداد وجود ندارد'
 RETURN
 END
IF (@Quantity=0)
  BEGIN
  SET @msgRet = 'تعداد استرداد را وارد کنید'
  RETURN
  END
  select  @preQuantity=isnull(Quantity , 0) from TEsterdad where ID=@ID
  if(@Quantity > @MandeRespon + @preQuantity)
  begin 
  set @msgRet = 'تعداد استرداد از مانده تعهد بیشتر می باشد'
  return
  end
  IF (@LetterNo = '' AND @LetterDate <> '' )
  BEGIN
  SET @msgRet = 'شماره نامه تغییر هزینه استرداد را وارد کنید'
  RETURN
  END
  IF (@LetterNo <> '' AND @LetterDate = '' )
  BEGIN
  SET @msgRet = 'تاریخ نامه تغییر هزینه استرداد را وارد کنید'
  RETURN
  END
  -- if ( @LetterNoSoud = '' and @LetterDateSoud <> '' )
  --begin
  --set @msgRet = 'شماره نامه تغییر  ضریب محاسبه سود استرداد را وارد کنید'
  --return
  --end
  --if ( @LetterNoSoud <> '' and @LetterDateSoud = '')
  --begin
  --set @msgRet = 'تاریخ نامه تغییر ضریب محاسبه سود استرداد را وارد کنید'
  --return
  --end
  --  if ( @LetterNoSoudDirkard = '' and @LetterDateSoudDirkard <> '' )
  --begin
  --set @msgRet = 'شماره نامه تغییر ضریب محاسبه جریمه دیرکرد استرداد را وارد کنید'
  --return
  --end
  --if ( @LetterNoSoudDirkard <> '' and @LetterDateSoudDirkard = '' )
  --begin
  --set @msgRet = 'تاریخ نامه تغییر ضریب محاسبه جریمه دیرکرد استرداد را وارد کنید'
  --return
  --end


  if (@CalcDate > @OrderDate)
  begin
  set @msgRet = 'تاریخ محاسبه خاتمه سود باید از تاریخ درخواست کوچکتر باشد'
  return
  end
  --------------------------------------------------
  if(@idRelatCustomerWithAccount <> 0 and @HaveAccounting = 0)
	  update TRespon set idRelatCustomerWithAccount=0 where ID=@IDRespon

  if(@idRelatCustomerWithAccount <>0)
  begin
  select @idCustomer1=idCustomer from TRelatCustomerWithAccount where id=@idRelatCustomerWithAccount
  select @idCustomer2=IDCustomer from TRelatResponWithCustomer where IDRespon=@IDRespon and Active=1 and idCustomer not in(select idCustomer from TLenders)
  if(@idCustomer1 <> @idCustomer2)
  begin
  set @msgRet= 'شماره حساب مشتری در قرارداد به مشتری فعلی آن تعلق ندارد'
  return
  end
  end
  --------------------------------------------------
  if exists (select * from VRelatResponwithPayment where IDRespon=@IDRespon and IdTypePayment=9 and FlagRelate>0)
  begin 
  set @msgRet='به دلیل وام تسهیلات امکان استرداد وجود ندارد'
  return
  end
  --------------------------------------------------

  set @Code=dbo.EsterdadCode(substring(@Date, 2, 3))
  Insert into dbo.TEsterdad(Code, IDRespon, IDCustomer, OrderDate, Quantity, --LetterNo, LetterDate,
                        HazineDefault, Hazine, UserID, SystemDate, IdHazineBase, idRelatCustomerWithAccount,
                        EsterdadDelay, MojavezSoudDirKard, ZaribSoud, ZaribSoudDirkard, CalcDate,
                        MaxDaySoudEsterdad, TypeCalcDate,EllatId)
                Values(@Code,@IDRespon,@IDCustomer,@OrderDate,@Quantity,--@LetterNo,@LetterDate,
                       @HazineDefault, @Hazine, @UserID, @Date, @IdHazineBase, @idRelatCustomerWithAccount,
                       @EsterdadDelay, @MojavezSoudDirKard, @ZaribSoud, @ZaribSoudDirkard, @CalcDate,
                       @MaxDaySoudEsterdad, @TypeCalcDate,@EllatId)
					   set @ID =SCOPE_IDENTITY()

  --select @Id=Id from TEsterdad where Code=@Code             
-----Add 94/06/22 for Information Soud---------------------------------------
  if @LetterNo<>'' begin
    INSERT INTO [Sale].[dbo].[TEsterdadInfoZarib](IdEsterdad, TypeId, LetterNo, LetterDate, UserId, SystemDate)
    VALUES (@ID, 1, @LetterNo, @LetterDate, @UserID, @Date)
  end

  if @LetterNoSoud<>'' 
    INSERT INTO [Sale].[dbo].[TEsterdadInfoZarib](IdEsterdad, TypeId, LetterNo, LetterDate, UserId, SystemDate)
    VALUES (@ID, 2, @LetterNoSoud, @LetterDateSoud, @UserID, @Date)

  --if @LetterNoSoudDirkard<>'' 
    INSERT INTO [Sale].[dbo].[TEsterdadInfoZarib](IdEsterdad, TypeId, LetterNo, LetterDate, UserId, SystemDate)
    VALUES (@ID, 3, @LetterNoSoudDirkard, @LetterDateSoudDirkard, @UserID, @Date)
--------------------------------------------
  -------------- set tedad esterdad in respon --------------------------------------------------- 
  exec SPUpdateOneResponFields @IDRespon
  --Exec SPTLogSale 'ثبت استرداد', @ID, @Date, @userid, 1

  	--=========================
				--   log ايجاد  
				--=========================
				declare @LogMsgInsert varchar(1000)
						--	 ,@AppName VARCHAR(50)
			 --select  @AppName=AppName  from secure.tbApplications  where AppId=@AppId 
				set @LogMsgInsert =' علت استرداد با کد تعهد:'+ CAST(@ResponCode AS varchar(15)) +
										 'ایجاد گردید.'

				exec sale.uspChangeLogCapture	 @tableName ='dbo.TEsterdad',@ActionType=2,@SqlCommand ='dbo.uspEsterdadResponInsert'
						,@UserId  =@UserId,@ComputerName  =@ComputerName,@LogMsg =@LogMsgInsert,@AppId =0,@OpId=0	,@Change‌dByAppId=0
  
-----------------------------------------------------------
-----------------------------------------------------------
 GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspEsterdadResponUpdate]'))
    drop view sale.[uspEsterdadResponUpdate]

GO
CREATE Procedure [sale].[uspEsterdadResponUpdate]

@ID as int,
@IDRespon as int,
@OrderDate AS VARCHAR(10),
@Quantity AS INT,
@HazineDefault AS INT,
@Hazine AS INT,
@IdHazineBase AS INT,
@idRelatCustomerWithAccount AS INT=0,
@EsterdadDelay AS INT=0,
@MojavezSoudDirKard AS TINYINT=0,
@LetterNo AS VARCHAR(15),
@LetterDate AS VARCHAR(10),
@LetterNoSoud AS VARCHAR(15),
@LetterDateSoud AS VARCHAR(10),
@LetterNoSoudDirkard AS VARCHAR(15),
@LetterDateSoudDirkard AS VARCHAR(10),
@ZaribSoud AS  FLOAT,
@ZaribSoudDirkard AS FLOAT,
@CalcDate VARCHAR(10),
@MaxDaySoudEsterdad INT,
@TypeCalcDate TINYINT,
@EllatId INT,
@UserID AS VARCHAR(10),
@ComputerName AS VARCHAR(50),
@msgRet AS VARCHAR(100) OUTPUT


As
DECLARE @Date AS VARCHAR(20) ,  @idCustomer AS INT, @MandeRespon AS INT , @ResponCode AS INT ,  @HaveAccounting AS INT , @idCustomer1 AS INT , @idCustomer2 AS INT,@Code as varchar(20) , @preQuantity as int=0

SET @Date=dbo.Shamsi(GETDATE(),0)

SELECT  @MandeRespon=Mande,@IdCustomer=IDOwnerCustomer,@ResponCode=Code , @HaveAccounting=HaveAccounting
  FROM dbo.VBaseRespon WHERE id=@IDRespon

  
----------------------- TestData
 
 IF EXISTS (SELECT idMoarefiName FROM dbo.TMoarefiName WHERE IdRespon=@IDRespon AND Flag<>0)
 BEGIN
 SET @msgRet = 'به دلیل وجود معرفی نامه جهت استفاده از وام تسهیلات امکان استرداد وجود ندارد'
 RETURN
 END
IF (@Quantity=0)
  BEGIN
  SET @msgRet = 'تعداد استرداد را وارد کنید'
  RETURN
  END
  select  @preQuantity=isnull(Quantity , 0) from TEsterdad where ID=@ID
  if(@Quantity > @MandeRespon + @preQuantity)
  begin 
  set @msgRet = 'تعداد استرداد از مانده تعهد بیشتر می باشد'
  return
  end
  IF (@LetterNo = '' AND @LetterDate <> '' )
  BEGIN
  SET @msgRet = 'شماره نامه تغییر هزینه استرداد را وارد کنید'
  RETURN
  END
  IF (@LetterNo <> '' AND @LetterDate = '' )
  BEGIN
  SET @msgRet = 'تاریخ نامه تغییر هزینه استرداد را وارد کنید'
  RETURN
  END
  -- if ( @LetterNoSoud = '' and @LetterDateSoud <> '' )
  --begin
  --set @msgRet = 'شماره نامه تغییر  ضریب محاسبه سود استرداد را وارد کنید'
  --return
  --end
  --if ( @LetterNoSoud <> '' and @LetterDateSoud = '')
  --begin
  --set @msgRet = 'تاریخ نامه تغییر ضریب محاسبه سود استرداد را وارد کنید'
  --return
  --end
  --  if ( @LetterNoSoudDirkard = '' and @LetterDateSoudDirkard <> '' )
  --begin
  --set @msgRet = 'شماره نامه تغییر ضریب محاسبه جریمه دیرکرد استرداد را وارد کنید'
  --return
  --end
  --if ( @LetterNoSoudDirkard <> '' and @LetterDateSoudDirkard = '' )
  --begin
  --set @msgRet = 'تاریخ نامه تغییر ضریب محاسبه جریمه دیرکرد استرداد را وارد کنید'
  --return
  --end


  if (@CalcDate > @OrderDate)
  begin
  set @msgRet = 'تاریخ محاسبه خاتمه سود باید از تاریخ درخواست کوچکتر باشد'
  return
  end
  --------------------------------------------------
  if(@idRelatCustomerWithAccount <> 0 and @HaveAccounting = 0)
	  update TRespon set idRelatCustomerWithAccount=0 where ID=@IDRespon

  if(@idRelatCustomerWithAccount <>0)
  begin
  select @idCustomer1=idCustomer from TRelatCustomerWithAccount where id=@idRelatCustomerWithAccount
  select @idCustomer2=IDCustomer from TRelatResponWithCustomer where IDRespon=@IDRespon and Active=1 and idCustomer not in(select idCustomer from TLenders)
  if(@idCustomer1 <> @idCustomer2)
  begin
  set @msgRet= 'شماره حساب مشتری در قرارداد به مشتری فعلی آن تعلق ندارد'
  return
  end
  end
  --------------------------------------------------
  if exists (select * from VRelatResponwithPayment where IDRespon=@IDRespon and IdTypePayment=9 and FlagRelate>0)
  begin 
  set @msgRet='به دلیل وام تسهیلات امکان استرداد وجود ندارد'
  return
  end
  --------------------------------------------------

   Begin try
   Begin transaction  tranUpdateTEsterdadRespon  

  if( ((select object_id('tempdb..#CurrentVersion')) is not null) )  drop table #CurrentVersion
  if( ((select object_id('tempdb..#OriginalVersion')) is not null) ) drop table #OriginalVersion

  select *  into #OriginalVersion from dbo.TEsterdad with(nolock) where  ID = @ID
  select *  into #CurrentVersion  from dbo.TEsterdad with(nolock) where  ID = @ID

   update  #CurrentVersion 
         set  IDRespon=@IDRespon, IDCustomer=@idCustomer, OrderDate=@OrderDate, Quantity=@Quantity,
                       LetterNo=@LetterNo, LetterDate=@LetterDate,
                       HazineDefault=@HazineDefault, Hazine=@Hazine,
                       idRelatCustomerWithAccount=@idRelatCustomerWithAccount, UserID=@UserID,
                       EsterdadDelay=@EsterdadDelay, MojavezSoudDirKard=@MojavezSoudDirKard,
                       Zaribsoud=@ZaribSoud,ZaribSoudDirkard=@ZaribSoudDirkard,CalcDate=@CalcDate,
                       MaxDaySoudEsterdad=@MaxDaySoudEsterdad,TypeCalcDate=@TypeCalcDate
					   ,EllatId = @EllatId
       

     declare @LogMsg varchar(1000)='', @SqlCommand   varchar(max)='', @ActionType   tinyint =1
     declare @tableName  varchar(50) = 'dbo.TEsterdad'  
      exec  sale.uspCreateMessageLog	 @tableName  =@tableName ,@LogMsg =@LogMsg output,@ActionType =@ActionType out	,@SqlCommand =@SqlCommand  output

  Update TEsterdad set IDRespon=@IDRespon, IDCustomer=@idCustomer, OrderDate=@OrderDate, Quantity=@Quantity,
                       LetterNo=@LetterNo, LetterDate=@LetterDate,
                       HazineDefault=@HazineDefault, Hazine=@Hazine,
                       idRelatCustomerWithAccount=@idRelatCustomerWithAccount, UserID=@UserID,
                       EsterdadDelay=@EsterdadDelay, MojavezSoudDirKard=@MojavezSoudDirKard,
                       Zaribsoud=@ZaribSoud,ZaribSoudDirkard=@ZaribSoudDirkard,CalcDate=@CalcDate,
                       MaxDaySoudEsterdad=@MaxDaySoudEsterdad,TypeCalcDate=@TypeCalcDate
					   ,EllatId = @EllatId
  Where ID=@ID
  
  
        	--======================
			-- Insert To Log table
			--======================
			PRINT @SqlCommand
			exec sale.uspChangeLogCapture	@tableName =@tableName,@ActionType =1,@SqlCommand =@SqlCommand,@UserId =@UserId
					,@ComputerName  =@ComputerName,@LogMsg  =@LogMsg,@AppId=0,@OpId=0,@Change‌dByAppId=0 


    -------------- set tedad esterdad in respon --------------------------------------------------- 
  exec SPUpdateOneResponFields @IDRespon


  if @LetterNo<>''
  begin 
    if exists(select * from TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=1)
      update TEsterdadInfoZarib set letterNo=@LetterNo, LetterDate=@LetterDate where IdEsterdad=@ID and TypeId=1
    else
      INSERT INTO [Sale].[dbo].[TEsterdadInfoZarib](IdEsterdad, TypeId, LetterNo, LetterDate, UserId, SystemDate)
      VALUES (@ID, 1, @LetterNo, @LetterDate, @UserID, @Date)
  end   

  if @LetterNoSoud<>''
  begin
    if exists(select * from TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=2)
    update TEsterdadInfoZarib set letterNo=@LetterNoSoud, LetterDate=@LetterDateSoud where IdEsterdad=@ID and TypeId=2
  else
    INSERT INTO [Sale].[dbo].[TEsterdadInfoZarib](IdEsterdad, TypeId, LetterNo, LetterDate, UserId, SystemDate)
    VALUES (@ID, 2, @LetterNoSoud, @LetterDateSoud, @UserID, @Date)
  end   

  if @LetterNoSoudDirkard<>''
  begin
    if exists(select * from TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=3)
      update TEsterdadInfoZarib set letterNo=@LetterNoSoudDirkard, LetterDate=@LetterDateSoudDirkard where IdEsterdad=@ID and TypeId=3
    else 
      INSERT INTO [Sale].[dbo].[TEsterdadInfoZarib](IdEsterdad, TypeId, LetterNo, LetterDate, UserId, SystemDate)
      VALUES (@ID, 3, @LetterNoSoudDirkard, @LetterDateSoudDirkard, @UserID, @Date)
  end
  
  if (@LetterNo)='' and exists(select * from TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=1)
  begin
    delete TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=1
    update TEsterdad set Hazine=0 where Id=@Id
  end  

  if (@LetterNoSoud='') and exists(select * from TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=2)
  begin
    delete TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=2
  end  

  if (@LetterNoSoudDirkard='') and exists(select * from TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=3)
  begin
    delete TEsterdadInfoZarib where IdEsterdad=@ID and TypeId=3
  end  

   commit transaction tranUpdateTEsterdadRespon 
  END TRY

	begin catch
	  if(@@trancount > 0)
		rollback transaction tranUpdateTEsterdadRespon
	  set @msgRet ='خطای ارتباطی رخ داده است'+ + ltrim(str( error_number() )) +
	     						 ', Procedure :'  + isnull(error_procedure(), '-') + 
									 ', Message :'+   + error_message()

	end catch
 ----------------------------------------------------
 ----------------------------------------------------
 GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspEsterdadResponDelete]'))
    drop view sale.[uspEsterdadResponDelete]

GO
CREATE Procedure  [sale].[uspEsterdadResponDelete]

@ID as int,
@UserID as varchar(10),
@msgRet as nvarchar(200) output
as
declare @IDRespon as int, @Esterdad as int, @ControlDate as varchar(10) , @Flag as int , @PardakhtNo as int 

select @IDRespon=idRespon, @Esterdad=isnull(Quantity, 0), @ControlDate=ControlDate , @Flag=Flag , @PardakhtNo=PardakhtNo
  from TEsterdad
 where ID=@ID

if @ControlDate<>''
begin
  set @msgRet = 'بدلیل تائید مالی امکان ابطال نمی باشد' 
  return
end
if (@Flag =0)
begin
  set @msgRet = 'بدلیل  ابطال امکان حذف نمی باشد' 
  return
end
if (@Flag =2)
begin
  set @msgRet = 'بدلیل ارسال به مالی امکان حذف نمی باشد' 
  return
end

if (@Flag =3)
begin
  set @msgRet = 'بدلیل تایید مالی امکان حذف نمی باشد' 
  return
end

if (@PardakhtNo > 0)
begin
  set @msgRet = 'بدلیل درخواست صدور چک امکان حذف نمی باشد' 
  return
end


delete from TResponPayUsedEsterdad where idEsterdad=@ID
delete from TEsterdad where id=@ID
delete from TEsterdadInfoZarib where IdEsterdad=@ID
update TRespon set Esterdad=Esterdad-@Esterdad where id=@idRespon
--Exec SPTLogSale 'حذف استرداد', @idRespon, '', @Userid, 3
--select '' as MsgError

  exec SPUpdateOneResponFields @IDRespon

  ---------------------------------------------------
  ---------------------------------------------------
   GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspGetMablaghEsterdadExtra]'))
    drop view sale.[uspGetMablaghEsterdadExtra]

GO
CREATE  procedure [sale].[uspGetMablaghEsterdadExtra]

-- @Code as int,
  @IdRespon as int

AS
        declare @CountMoarefi AS INT , @CountResponWithPayment As INT
        
       
		--0
		Select @CountMoarefi=Count(*)  from VMoarefiName where IdRespon=@IdRespon and flag<>0
		--1
		select @CountResponWithPayment= COUNT(*) from VRelatResponWithPayment where IDRespon=@IdRespon and FlagRelate<>0 and ControlDateRelate=''
		
----------------------------------------------------
----------------------------------------------------
 GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspPayUsedEsterdadKoliInsert]'))
    drop view sale.[uspPayUsedEsterdadKoliInsert]

GO
CREATE   Procedure [sale].[uspPayUsedEsterdadKoliInsert]
@ID as int,
@IDRespon as int,
@IDEsterdad as int,
@IDRelatResponWithPayment as int,
@UserID as varchar(10),
@msgRet as nvarchar(200) output

AS


declare  @OrderDate as varchar(10), @ResponDate as varchar(10), @TailDateDueDeliver as varchar(10),
        @idSaleProjects as int, @VariationDelay as int, @VariationDayNoSoud as int, @DiffDate as int,
        @SystemDate as varchar(20), @MojavezSoudDirKard as Tinyint, @CalcDate as Varchar(10),
        @MaxDaySoudEsterdad as int, @SystemDateMohasebe as varchar(10)

set @SystemDate=dbo.Shamsi(getDate(), 0)
select @ResponDate=ResponDate, @idSaleProjects=idSaleProjects
  from TRespon
 where id=@IDRespon

select @VariationDelay=VariationDelay, @VariationDayNoSoud=VariationDayNoSoud
  from TBase
 where idSaleProject=@idSaleProjects

select @OrderDate=OrderDate, @MojavezSoudDirKard=MojavezSoudDirKard, @CalcDate=CalcDate,
       @MaxDaySoudEsterdad=MaxDaySoudEsterdad
  from TEsterdad
 where id=@IDEsterdad

select @TailDateDueDeliver=TailDateDueDeliver
  from VRespon
 where id=@IDRespon

if @MaxDaySoudEsterdad=0  
  set @SystemDateMohasebe=@CalcDate
else  
  set @SystemDateMohasebe=dbo.AddDate(@ResponDate, 0, @MaxDaySoudEsterdad)
  
set @DiffDate=dbo.DiffDate(@ResponDate, @CalcDate)

---------------------------------------------------------------
---------------------------------------------------------------

declare @MandeRespon as int
select @MandeRespon = MandeRespon from VMandeRelatResponWithPayment where  ID = @IDRelatResponWithPayment
if(@MandeRespon = 0)
BEGIN
  SET 	@msgRet='مانده ای جهت استرداد وجود ندارد'
  return
END

IF NOT EXISTS(     SELECT *  from VMandeRelatResponWithPayment WHERE MandeResponOk>0 AND  IDRespon=@IDRespon)
BEGIN
  SET 	@msgRet='مانده ای جهت استرداد وجود ندارد'
  return
END

declare @FlagEsterdad as int 
select @FlagEsterdad = Flag from VBaseEsterdad where ID= @IDEsterdad
if(@FlagEsterdad <> 1)
BEGIN
  SET 	@msgRet='استرداد در وضعیت موقت نمی باشد'
  return
END
--------------------------------------------------------------
--------------------------------------------------------------

   Begin try
   Begin transaction  tranEsterdadKoliInsert           
   if @DiffDate<@VariationDelay
     BEGIN
		
		  Insert into TResponPayUsedEsterdad(IDRelatResponWithPayment, IDEsterdad, EffectiveDate, Amount,
											 Soud, SoudDirKard, UserID, SystemDate, idCustomerZihesab)
		  select IdRelate, @IDEsterdad, substring(@SystemDate, 1, 10), MandeResponOk,
				 0, 0, @userId, @SystemDate, idCustomerZihesabRelate
			from VMandeRelatResponWithPayment
		   where IdRespon=@IDRespon
			 and MandeResponOK<>0                      	
     END


ELSE BEGIN
	
     Insert into TResponPayUsedEsterdad(IDRelatResponWithPayment, IDEsterdad, EffectiveDate, Amount, Soud, SoudDirKard, UserID, SystemDate, idCustomerZihesab)
  --select IdRelate, @IdEsterdad, dbo.Shamsi(getDate(), 1), MandeRespon, dbo.SoudEsterdad(idrelate, @OrderDate, MandeRespon, 1, 1), case @MojavezSoudDirKard when 0 then 0 else dbo.SoudEsterdad(idrelate, @OrderDate, MandeRespon, 1, 2) end, @userId, dbo.Shamsi(getDate(),0)
  --select IdRelate, @IdEsterdad, dbo.Shamsi(getDate(), 1), MandeRespon, dbo.SoudEsterdad(idrelate,Case when @SystemDateMohasebe<@CalcDate then @SystemDateMohasebe else @CalcDate end, MandeRespon, 1, 1), case @MojavezSoudDirKard when 0 then 0 else dbo.SoudEsterdad(idrelate, @CalcDate, MandeRespon, 1, 2) end, @userId, dbo.Shamsi(getDate(),0)
  select IdRelate, @IDEsterdad, substring(@SystemDate, 1, 10), MandeResponOk,
         dbo.SoudEsterdad(idrelate, @CalcDate, MandeResponOk, 1, 1, 0, @IDEsterdad),
         case @MojavezSoudDirKard
              when 0 then 0
                     else dbo.SoudEsterdad(idrelate, @CalcDate, MandeResponOk, 1, 2, 1, @IDEsterdad)
          end, @userId, @SystemDate, idCustomerZihesabRelate
    from VMandeRelatResponWithPayment
   where IdRespon=@IDRespon
     and MandeResponOk<>0
     END


set @id=@@identity
Exec SPQueueControl @IDRespon

--Exec SPTLogSale 'استرداد وجه', @Id, '', @userid, 1

  commit transaction tranEsterdadKoliInsert 
  END TRY

	begin catch
	  if(@@trancount > 0)
		rollback transaction tranEsterdadKoliInsert
		PRINT error_message()
	  set @msgRet ='خطای ارتباطی رخ داده است'+ + ltrim(str( error_number() )) +
	     						 ', Procedure :'  + isnull(error_procedure(), '-') + 
									 ', Message :'+   + error_message()
									 

	end catch

    -------------------------------------------------
    -------------------------------------------------
    GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspPayUsedEsterdadInsert]'))
    drop view sale.[uspPayUsedEsterdadInsert]

GO
CREATE Procedure[sale].[uspPayUsedEsterdadInsert]

@ID as int,
@IDRelatResponWithPayment as int,
@IDEsterdad as int,
@EffectiveDate as VarChar(10),
@Amount as numeric,
@UserID as VarChar(10),
@msgRet as nvarchar(200) output

As
declare @Date as Varchar(20), @OrderDate as varchar(10), @MojavezSoudDirKard as Tinyint,
        @Soud as numeric, @SoudDirKard as numeric, @idRespon as int

set @Date=dbo.Shamsi(GetDate(), 0)
select @OrderDate=OrderDate, @idRespon=idRespon, @MojavezSoudDirKard=MojavezSoudDirKard
  from TEsterdad
 where Id=@idesterdad
 ------------------------------------------------------
 ------------------------------------------------------

	declare @MandeRespon as int , @FlagEsterdad as int  , @CalculateDate as varchar(10) , @IDPayment as int , @ResponDate as varchar(10)

	select @MandeRespon = MandeRespon , @IDPayment = IDPayment from VMandeRelatResponWithPayment where  ID = @IDRelatResponWithPayment
	if(@MandeRespon = 0)
	BEGIN
	  SET 	@msgRet='مانده ای جهت استرداد وجود ندارد'
	  return
	END


	select @FlagEsterdad = Flag from VBaseEsterdad where ID= @IDEsterdad
	if(@FlagEsterdad <> 1)
	BEGIN
	  SET 	@msgRet='استرداد در وضعیت موقت نمی باشد'
	  return
	END

	if(@Amount > @MandeRespon)
	BEGIN
	  SET 	@msgRet='این مبلغ قابل تخصیص نمی باشد'
	  return
	END

	select @CalculateDate=CalculateDate  From TPayment Where ID= @IDPayment
	if(@EffectiveDate < @CalculateDate)
	BEGIN
	  SET 	@msgRet='تاریخ مبنای محاسبه نباید کوچکتر از تاریخ مبنای محاسبه مبلغ دریافتی باشد'
	  return
	END
	select @ResponDate = ResponDate  From TRespon Where ID = @IDPayment
	if(@EffectiveDate < @ResponDate)
	BEGIN
	  SET 	@msgRet='تاریخ مبنای محاسبه نباید از تاریخ قرارداد کوچکتر باشد'
	  return
	END
 ------------------------------------------------------
 ------------------------------------------------------

  Begin try
   Begin transaction  tranEsterdadInsert 

	Insert into TResponPayUsedEsterdad(IDRelatResponWithPayment, IDEsterdad, EffectiveDate, Amount, UserID, SystemDate)
	Values(@IDRelatResponWithPayment, @IDEsterdad, @EffectiveDate, @Amount, @UserID, dbo.Shamsi(getDate(), 0))
	set @ID=@@identity

	Exec SPQueueControl @idRespon

	--set @Soud=isnull(dbo.SoudEsterdad(@IDRelatResponWithPayment, @OrderDate, @Amount, 1, 1), 0)
	--Add 94/11/25
	set @Soud=isnull(dbo.SoudEsterdad(@IDRelatResponWithPayment, @OrderDate, @Amount, 1, 1, 0, @IdEsterdad), 0)
	if @MojavezSoudDirKard=0
	  set @SoudDirKard=0
	else
	  set @SoudDirKard=isnull(dbo.SoudEsterdad(@IDRelatResponWithPayment, @OrderDate, @Amount, 1, 2, 1, @IdEsterdad), 0)
	update TresponPayUsedEsterdad
	   set Soud=@Soud, SoudDirKard=@SoudDirKard
	 where id=@id
    --Exec SPTLogSale 'استرداد وجه', @Id, @Date, @userid, 1

 commit transaction tranEsterdadInsert 
  END TRY

	begin catch
	  if(@@trancount > 0)
		rollback transaction tranEsterdadInsert
		PRINT error_message()
	  set @msgRet ='خطای ارتباطی رخ داده است'+ + ltrim(str( error_number() )) +
	     						 ', Procedure :'  + isnull(error_procedure(), '-') + 
									 ', Message :'+   + error_message()
									 

	end catch

    -----------------------------------------------------
    -----------------------------------------------------

    GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspPayUsedEsterdadDelete]'))
    drop view sale.[uspPayUsedEsterdadDelete]

GO
CREATE Procedure [sale].[uspPayUsedEsterdadDelete]
@ID as int,
@msgRet nvarchar(200) output

as

delete from TResponPayUsedEsterdad where ID=@ID

-------------------------------------------------------
-------------------------------------------------------
 GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspEsterdadResponErsalMaliUpdate]'))
    drop view sale.[uspEsterdadResponErsalMaliUpdate]

GO
CREATE Procedure [sale].[uspEsterdadResponErsalMaliUpdate]
@ID as int,
@msgRet nvarchar(200) output

as

declare @Flag as int
select @Flag from dbo.VBaseEsterdad where ID=@ID

	if(@Flag=0)
	begin
	set @msgRet = 'به دلیل ابطال استرداد امکان ارسال به مالی وجود ندارد'
	return
	end

    if(@Flag=2)
	begin
	set @msgRet = 'قبلا ارسال شده است'
	return
	end

	 if(@Flag=3)
	begin
	set @msgRet = 'استرداد مورد نظر تایید مالی شده است'
	return
	end

   
    update  dbo.TEsterdad set Flag=2 where ID=@ID  

    ---------------------------------------------
    ---------------------------------------------
    GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspGetEsterdadPrintData]'))
    drop view sale.[uspGetEsterdadPrintData]

GO
CREATE  procedure [sale].[uspGetEsterdadPrintData]
 @IdEsterdad as int

AS
     DECLARE @idRespon AS int , @IDSaleProjects as int ,@CalcDate as varchar(10),@ResponWithCustomer AS VARCHAR(200),@CountChek AS INT,@SumAmount AS NUMERIC(18,0),@SumAmountChek AS NUMERIC(18,0)
			 ,@SumSoud AS NUMERIC(18,0),@SumSoudDirkard AS NUMERIC(18,0),@SumBothSoud AS NUMERIC(18,0),@EsterdadHazine AS NUMERIC(18,0) , @idBaseCalcEstrdDate as int , 
			 @EffectiveDate as varchar(10), @CalculateDate as varchar(10), @ResponDate as varchar(10),
			 @idTypePayment as int, @DateVosol as varchar(10), @OdatDate as varchar(10), @TaeedNahaiDate as varchar(10),
			 @ControlDate as varchar(10), @TypeRelate as char(1), @idPayment as int, @MaxDaySoudEsterdad as int,
			 @EsterdadDelay as int, @TailDateDueDeliver as varchar(10), @DiffDate1 as int , @DiffDate2 as int, @idRelatResponWithPayment as int ,
			 @EsterdadDelayEsterdad as int , @DiffDateDirKard as int , @LizingName as varchar(50), @SumRialLizing as int=0 ,
			 @FimabinName as varchar(50), @SumRialFimabin as int=0

      --0
      select * from VResponPayUsedEsterdadMandeRespon where idEsterdad=@IdEsterdad

	  -------------------------------------------------------------


      SELECT @idRespon=t.IDRespon,@CalcDate=t.CalcDate , @MaxDaySoudEsterdad=MaxDaySoudEsterdad  FROM TEsterdad AS t where id=@IdEsterdad
	  select @IDSaleProjects= IDSaleProjects from VRespon where ID=@idRespon 
    
      SELECT @ResponWithCustomer = stuff((SELECT ' - ' + CustomerName FROM VRelatResponwithCustomer where idrespon=@idRespon  and active=1 FOR XML PATH ('')), 2, 1, '') --as responwithCustomer
	  select @EsterdadDelay=isnull(EsterdadDelay, 0)*1 from TSanadInfo

	  select @SumAmount=ISNULL(Sum(Amount) , 0),@SumSoud=ISNULL(Sum(Soud),0),@SumSoudDirkard=ISNULL(Sum(SoudDirKard),0) 
	  from VResponPayUsedEsterdadMandeRespon where idEsterdad=@IdEsterdad 
	  select @DiffDateDirKard = DiffDateDirKard , @idRelatResponWithPayment = IDRelatResponWithPayment from VResponPayUsedEsterdadMandeRespon where idEsterdad=@IdEsterdad 

	  select @CalculateDate=CalculateDate, @ResponDate=ResponDate,
			 @idTypePayment=idTypePayment,@DateVosol=DateVosol, @OdatDate=OdatDate,
			 @TaeedNahaiDate=TaeedNahaiDate, @TypeRelate=TypeRelate, @idPayment=idPayment
	          from VRelatResponWithPaymentSoud where id=@idRelatResponWithPayment
  

	 if @CalculateDate<@ResponDate
		set @EffectiveDate=@ResponDate
	  else
		set @EffectiveDate=@CalculateDate

	  if @idTypePayment=6  
	  begin
		if @DateVosol<>''
		  if @DateVosol<@ResponDate
			set @EffectiveDate=@ResponDate
		  else
			set @EffectiveDate=@DateVosol
	  end
	  if @idTypePayment=8
	  begin
		if @TypeRelate='Y'
		  if exists(select * from VMasterRename where Type=4 and idPayment=@idPayment and Flag=3)
		  begin
			select @ControlDate=ControlDate from VMasterRename where Type=4 and idPayment=@idPayment and Flag=3
			set @EffectiveDate=@ControlDate
		  end
	  end
	  if @idTypePayment=9
	  begin
		if @TaeedNahaiDate<>''
		  set @EffectiveDate=@TaeedNahaiDate
	  end
      
	  set @DiffDate1=dbo.DiffDate(@EffectiveDate, @CalcDate)
	  if @MaxDaySoudEsterdad>0
		if @MaxDaySoudEsterdad<@DiffDate1
		  set @DiffDate1=@MaxDaySoudEsterdad
	  set @DiffDate1=@DiffDate1+@EsterdadDelay


	select @idBaseCalcEstrdDate = IDBaseCalcEstrdDate from TEsterdadSoudBase where IDSaleProject=@IDSaleProjects
	if (@idBaseCalcEstrdDate = 1)
	set @DiffDate1 = @DiffDate1
	else 
	set @DiffDate1 = @DiffDate1 / 30 
	----------------------------------------------
	select @EsterdadDelayEsterdad = EsterdadDelay from VBaseEsterdad where ID = @IdEsterdad
	
	if (@idBaseCalcEstrdDate = 1)
	set @DiffDate2 = @DiffDateDirKard + @EsterdadDelayEsterdad
	else 
	set @DiffDate2 = (@DiffDateDirKard + @EsterdadDelayEsterdad) / 30 
---------------------------------------------------
		
	-- مجموع و تعداد مبالغ چک های دریافتی
	select @SumAmountChek=ISNULL(Sum(Amount) , 0) , @CountChek=COUNT(*) from VResponPayUsedEsterdadMandeRespon where idEsterdad=@IdEsterdad and odatDate=''  and DateVosol='' and
		IdPayment in (select Id from Tpayment where idtypepayment=6)

	select @LizingName=isnull(SahebVajh , '') , @SumRialLizing = isnull(Sum(Amount),0)  from VResponPayUsedEsterdad where idesterdad=@IdEsterdad and idTypepayment=9 GROUP BY SahebVajh 
	select @FimabinName =isnull(SahebVajh,'') ,@SumRialFimabin =isnull(Sum(Amount),0) from VResponPayUsedEsterdad where idesterdad=@IdEsterdad and idTypepayment=8 GROUP BY SahebVajh
		
	--1	
    SELECT @ResponWithCustomer AS responwithCustomer, @DiffDate1 as DiffDate1 , @DiffDate2 as DiffDate2
    ,@CountChek AS CountChek, @SumAmountChek AS SumAmountChek
    ,@SumAmount AS SumAmount ,@SumSoud AS SumSoud,@SumSoudDirkard AS SumSoudDirkard
    ,ISNULL(@LizingName,'') as LizingName , @SumRialLizing as SumRialLizing, ISNULL(@FimabinName,'') as FimabinName , @SumRialFimabin as SumRialFimabin 


-----------------------------------------------------
-----------------------------------------------------
-- حق العمل ویژه
 GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspGetCommissionExtraData]'))
    drop view sale.[uspGetCommissionExtraData]

GO
 CREATE  procedure [sale].[uspGetCommissionExtraData]


AS
        --0
		Select ID as [value] , Title as [label] From TTypeAgencyCooperation Order by Id                                               
		--1
		Select ID as [value] , Title as [label] From TTypeCalcCommission where id>2 Order by Id

---------------------------------------------------
---------------------------------------------------
GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspGetStepCommission]'))
    drop view sale.[uspGetStepCommission]

GO
 CREATE  procedure [sale].[uspGetStepCommission]

 @idSaleProjects int,
 @IdTypeAgencyCooperation int,
 @IdTypeCalcCommission int,
 @IdLemSale int

AS

select (ISNULL(max(Step),0)+1) as step  from TSaleProjectsCommission where idSaleProjects=@idSaleProjects and idTypeAgencyCooperation=@IdTypeAgencyCooperation and idTypeCalcCommission=@IdTypeCalcCommission and idLemSale=@IdLemSale

--------------------------------------------------
--------------------------------------------------
	GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspSaleProjectsCommissionInsert]'))
    drop view sale.[uspSaleProjectsCommissionInsert]

GO
CREATE Procedure [sale].[uspSaleProjectsCommissionInsert]

@IdSaleProjects as int,
@IdSaleProjectsCommission as int,
@IdTypeAgencyCooperation as int,
@IdTypeCalcCommission as int,
@IdLemSale as int,
@StartDate as varchar(10)='',
@EndDate as varchar(10)='',
@Step as int,
@LimmitOfStep as int,
@AmountCommission as numeric(18,0)=0,
@Coefficient as Float=0,
@UserID as VarChar(10)='',
@msgRet nvarchar(200) output

As

declare @Date as Varchar(20), @msgError as Varchar(100), @EndDateFirst as Varchar(10)
set @Date=dbo.Shamsi(GetDate(), 0)


set @msgRet=''
if (@Coefficient=0 and  @AmountCommission=0)
begin
set @msgRet='مبلغ حق العمل و یا ضریب حق العمل را وارد کنید'
return
end

if (@LimmitOfStep = 0 )
begin
set @msgRet='تعدا خودرو در این گام را مشخص کنید'
return
end


    INSERT INTO dbo.TSaleProjectsCommission(IdSaleProjects, IdTypeAgencyCooperation, IdTypeCalcCommission,
                                            IdLemSale, StartDate, EndDate, Step, LimmitOfStep, AmountCommission,
                                            Coefficient, Userid, SystemDate)
    VALUES(@IdSaleProjects, @IdTypeAgencyCooperation, @IdTypeCalcCommission,
           @IdLemSale, @StartDate, @EndDate, @Step, @LimmitOfStep, @AmountCommission,
           @Coefficient, @Userid, @Date)
 
 	-- log ايجاد  
				-- ---------------------------------
				declare @LogMsgInsert varchar(1000)
				set @LogMsgInsert =' حق العمل ویژه برای کد طرح فروش به شماره ' +CAST(@IdSaleProjects AS VARCHAR) +'ایجاد گردید'
				exec sale.uspChangeLogCapture  @tableName ='dbo.TSaleProjectsCommission',@ActionType=2,@SqlCommand ='[sale].[uspSaleProjectsCommissionInsert]'
						,@UserId = @UserID, @ComputerName  ='',@LogMsg =@LogMsgInsert,@AppId =0,@OpId=0,@Change‌dByAppId=0
         

--------------------------------------------------------
--------------------------------------------------------
GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspSaleProjectsCommissionUpdate]'))
    drop view sale.[uspSaleProjectsCommissionUpdate]

GO
CREATE Procedure [sale].[uspSaleProjectsCommissionUpdate]

@IdSaleProjects as int,
@IdSaleProjectsCommission as int,
@IdTypeAgencyCooperation as int,
@IdTypeCalcCommission as int,
@IdLemSale as int,
@StartDate as varchar(10)='',
@EndDate as varchar(10)='',
@Step as int,
@LimmitOfStep as int,
@AmountCommission as numeric(18,0)=0,
@Coefficient as Float=0,
@UserID as VarChar(10)='',
@msgRet nvarchar(200) output

As



set @msgRet=''
if (@Coefficient=0 and  @AmountCommission=0)
begin
set @msgRet='مبلغ حق العمل و یا ضریب حق العمل را وارد کنید'
return
end

if (@LimmitOfStep = 0 )
begin
set @msgRet='تعدا خودرو در این گام را مشخص کنید'
return
end

  Begin try
   Begin transaction  tranCommisionUpdate   

-- ایجاد Log
	if( ((select object_id('tempdb..#CurrentVersion')) is not null) )  drop table #CurrentVersion
     if( ((select object_id('tempdb..#OriginalVersion')) is not null) ) drop table #OriginalVersion
     
     select *  into #OriginalVersion from dbo.TSaleProjectsCommission with(nolock) where  IdSaleProjectsCommission = @IdSaleProjectsCommission
    select *  into #CurrentVersion  from dbo.TSaleProjectsCommission with(nolock) where  IdSaleProjectsCommission = @IdSaleProjectsCommission
    
        update  #CurrentVersion 
         set idSaleProjects=@idSaleProjects, IdTypeAgencyCooperation=@IdTypeAgencyCooperation,
           IdTypeCalcCommission=@IdTypeCalcCommission, IdLemSale=@IdLemSale, StartDate=@StartDate,
           EndDate=@EndDate, Step=@Step, LimmitOfStep=@LimmitOfStep, AmountCommission=@AmountCommission,
           Coefficient=@Coefficient, UserID=@UserID
   
      declare @LogMsg varchar(1000)='', @SqlCommand   varchar(max)='', @ActionType   tinyint =1
      declare @tableName  varchar(50) = 'dbo.TSaleProjectsCommission'  
      exec  sale.uspCreateMessageLog	 @tableName  =@tableName ,@LogMsg =@LogMsg output,@ActionType =@ActionType out	,@SqlCommand =@SqlCommand  output  



	  -------
 
 Update dbo.TSaleProjectsCommission
       set idSaleProjects=@idSaleProjects, IdTypeAgencyCooperation=@IdTypeAgencyCooperation,
           IdTypeCalcCommission=@IdTypeCalcCommission, IdLemSale=@IdLemSale, StartDate=@StartDate,
           EndDate=@EndDate, Step=@Step, LimmitOfStep=@LimmitOfStep, AmountCommission=@AmountCommission,
           Coefficient=@Coefficient, UserID=@UserID
     Where IdSaleProjectsCommission=@IdSaleProjectsCommission

commit transaction tranCommisionUpdate 
  END TRY

	begin catch
	  if(@@trancount > 0)
		rollback transaction tranCommisionUpdate
	  set @msgRet ='خطای ارتباطی رخ داده است'+ + ltrim(str( error_number() )) +
	     						 ', Procedure :'  + isnull(error_procedure(), '-') + 
									 ', Message :'+   + error_message()

	end catch

    ----------------------------------------------------
    ----------------------------------------------------
    GO
if exists (select * from dbo.sysobjects where id = object_id(N'sale.[uspSaleProjectsCommissionDelete]'))
    drop view sale.[uspSaleProjectsCommissionDelete]

GO

CREATE Procedure [sale].[uspSaleProjectsCommissionDelete]

@IdSaleProjectsCommission as int,
@msgRet nvarchar(200) output
As

set @msgRet=''

declare @idSaleProjects int , @idTypeAgencyCooperation int , @idTypeCalcCommission int , @idLemSale int , @Step int
select @idSaleProjects=IdSaleProjects , @idTypeAgencyCooperation=IdTypeAgencyCooperation , @idTypeCalcCommission=IdTypeCalcCommission,
@idLemSale=IdLemSale , @Step=Step
from dbo.TSaleProjectsCommission where IdSaleProjectsCommission=@IdSaleProjectsCommission


Delete TSaleProjectsCommission where IdSaleProjectsCommission=@IdSaleProjectsCommission

if not exists (Select * From TSaleProjectsCommission where idSaleProjects=@idSaleProjects and idTypeAgencyCooperation=@idTypeAgencyCooperation 
and idTypeCalcCommission=@idTypeCalcCommission and idLemSale=@idLemSale and Step=@Step)

Update TSaleProjectsCommission 
set Step=Step-1 where idSaleProjects=@idSaleProjects and idTypeAgencyCooperation=@idTypeAgencyCooperation and
    idTypeCalcCommission=@idTypeCalcCommission and idLemSale=@idLemSale and Step>@Step



    ----------------------------------------------------
    ----------------------------------------------------
    