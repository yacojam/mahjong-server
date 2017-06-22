var ThreeInfo = function(isKanzi,pai){
    this.isKanzi = isKanzi;
    this.pai = pai;
};

ThreeInfo.prototype.isTangWithPai = function(pai){
    return !this.isKanzi && this.pai == pai;
};
module.exports = ThreeInfo;