const EventOrganizer = artifacts.require("EventOrganizer");

module.exports = function(deployer) {
  deployer.deploy(EventOrganizer);
};