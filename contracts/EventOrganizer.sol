// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EventOrganizer {
  struct Event {
    uint id;
    address owner;
    string name;
    uint date;
    uint ticketPrice;
    uint ticketCount;
    uint ticketRemaining;
  }
  mapping(uint => Event) public events;
  mapping(address => mapping(uint => uint)) public tickets;
  uint public eventId;

  function createEvent(string calldata eventName, uint eventDate, uint price, uint eventCapacity) external {
    require(block.timestamp < eventDate, 'Event start date should be in future.');
    require(eventCapacity > 0, 'Minimum capacity (ticket count) should be 1.');
    events[eventId] = Event(eventId, msg.sender, eventName, eventDate, price, eventCapacity, eventCapacity);
    eventId++;
  }

  function buyTicket(uint id, uint amount) eventExists(id) eventActive(id) payable external {
    require(msg.value >= (events[id].ticketPrice * amount), 'Not enough ETH is sent to pay the tickets.');
    require(events[id].ticketRemaining >= amount, 'Not enough tickets.');
    events[id].ticketRemaining -= amount;
    tickets[msg.sender][id] += amount;
  }

  function transferTicket(uint id, uint amount, address to) eventExists(id) eventActive(id) external {
    require(tickets[msg.sender][id] >= amount, 'Not enough tickets to transfer.');
    tickets[msg.sender][id] -= amount;
    tickets[to][id] += amount;
  }

  function getAllEvents() external view returns (Event[] memory){
    Event[] memory eventArray = new Event[](eventId);
    for (uint i = 0; i < eventId; i++) {
        eventArray[i] = events[i];
    }
    return eventArray;
  }

  modifier eventExists(uint id) {
    require(events[id].date != 0, 'Event does not exist.');
    _;
  }

  modifier eventActive(uint id) {
    require(block.timestamp < events[id].date, 'Event is not active anymore.');
    _;
  }
}
