var WrappedMillix = artifacts.require("WrappedMillix");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(WrappedMillix);
};