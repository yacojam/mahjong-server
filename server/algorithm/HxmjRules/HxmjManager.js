const Action = require('./hxaction');
const CommonRules = require('./CommonRules')

exports.getActions = function (shouPais, pengPais, action, desPai) {
	var actions = [];
	switch(action){
		//别人出的牌，只能产生，炮胡，碰，碰杠
		case Action.ACTION_CHU:
            if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
            	actions.push(Action.makeuAction(Action.ACTION_PAOHU, desPai));
            };
            var num = CommonRules.getPaiNum(shouPais, desPai);
            if (num == 3) {
            	actions.push(Action.makeuAction(Action.ACTION_PGANG, desPai));
            	actions.push(Action.makeuAction(Action.ACTION_PENG, desPai));
            } else if(num == 2)
            {
            	actions.push(Action.makeuAction(Action.ACTION_PENG, desPai));
            }
            return actions;
		    break;
        
        //别人弯杠的牌，只能产生抢杠胡
        case Action.ACTION_WGANG: 
            if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
            	actions.push(Action.makeuAction(Action.ACTION_QGHU, desPai));
            };
            return actions;
            break;

        //自己摸的牌，只能产生，自摸，暗杠，弯杠
        case Action.ACTION_MO:
            //自摸检测
            if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
            	actions.push(Action.makeuAction(Action.ACTION_ZIMO, desPai));
            };
            //弯杠检测
            var wgpais = CommonRules.getWanGangPais(shouPais,desPai,pengPais);
            if (wgpais.length > 0) {
            	wgpais.forEach(function(e){
            		actions.push(Action.makeuAction(Action.ACTION_WGANG, e));
            	});
            };
            //暗杠检测
            var agpais = CommonRules.getAnGangPais(shouPais, desPai);
            if (agpais.length > 0) {
            	agpais.forEach(function(e){
            		actions.push(Action.makeuAction(Action.ACTION_ANGANG, e));
            	});
            };
            return actions;
            break;

        //杠摸，只能产生，杠上花，暗杠，弯杠
        case Action.ACTION_GMO:
            //自摸检测
            if (CommonRules.getHuType(pengPais, shouPais, desPai) > 0) {
            	actions.push(Action.makeuAction(Action.ACTION_GSHUA, desPai));
            };
            //弯杠检测
            var wgpais = CommonRules.getWanGangPais(shouPais,desPai,pengPais);
            if (wgpais.length > 0) {
            	wgpais.forEach(function(e){
            		actions.push(Action.makeuAction(Action.ACTION_WGANG, e));
            	});
            };
            //暗杠检测
            var agpais = CommonRules.getAnGangPais(shouPais, desPai);
            if (agpais.length > 0) {
            	agpais.forEach(function(e){
            		actions.push(Action.makeuAction(Action.ACTION_ANGANG, e));
            	});
            };
            return actions;
            break;

        default: 
            break;
	}
	return actions;
};

