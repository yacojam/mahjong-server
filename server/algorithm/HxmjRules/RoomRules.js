Class RoomRules{
	constructor(isFengForThreeKan,isNaForDouble,isNaFor3Gang,isNaForQYS,isNaFor31,isNaForThreeKanAndTou,isNaForZFB,isNaForAnLXT,isNaFor50Point,isNaForDTCZM){
		//是不是随风三大砍
        this.isFengForThreeKan = isFengForThreeKan;

        //逢双拿不拿，除双杠，双连号，但不包括三杠
        this.isNaForDouble = isNaForDouble;
        //三杠拿不拿
        this.isNaFor3Gang = isNaFor3Gang;
        //清一色拿不拿
        this.isNaForQYS = isNaForQYS;
        //31点加10点拿不拿
        this.isNaFor31 = isNaFor31;
    
        //三大砍带头拿不拿
        this.isNaForThreeKanAndTou = isNaForThreeKanAndTou;

        //中发白拿不拿
        this.isNaForZFB = isNaForZFB;
    
        //暗老小头拿不拿
        this.isNAForAnLXT = isNaForAnLXT;
    
        //点炮50点，自摸100点
        this.isNaFor50Point = isNaFor50Point;
        
        //大跳车自摸拿不拿
        this.isNaForDTCZM = isNaForDTCZM;
	}
};

module.exports = RoomRules;