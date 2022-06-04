const { expectRevert, time } = require('@openzeppelin/test-helpers');
const EventOrganizer = artifacts.require('EventOrganizer');

contract('EventOrganizer', (accounts) => {
  let eventOrganizer = null;
  before(async () => {
    eventOrganizer = await EventOrganizer.new();
  });

  it('Should NOT create an event if start date is in the past', async () => {
    const date = (await time.latest()).sub(time.duration.seconds(1));  
    await expectRevert(eventOrganizer.createEvent('event1', date, 5, 10), 'Event start date should be in future.');
  });

  it('Should NOT create an event if ticket capacity is less than 1', async () => {
    const date = (await time.latest()).add(time.duration.seconds(1000));  
    await expectRevert(eventOrganizer.createEvent('event', date, 5, 0), 'Minimum capacity (ticket count) should be 1.');
  });

  it('Should create an event', async () => {
    const date = (await time.latest()).add(time.duration.seconds(1000));  
    await eventOrganizer.createEvent('event', date, 5, 100);
    const event = await eventOrganizer.events(0);
    assert(event[0].toNumber() === 0); 
    assert(event[2] === 'event');
    assert(event[3].toNumber() === date.toNumber()); 
  });

  it('Should not buy a ticket if event does not exists', async () => {
    await expectRevert(eventOrganizer.buyTicket(99, 99), 'Event does not exist.');
  });

  context('event created', () => {
    beforeEach(async () => {
      const date = (await time.latest()).add(time.duration.seconds(1000));  
      await eventOrganizer.createEvent('XXX', date, 5, 2);
    });

    it('Should NOT buy a ticket if not paid fully', async () => {
        await expectRevert(eventOrganizer.buyTicket(0, 1), 'Not enough ETH is sent to pay the tickets.');
    });

    it('Should NOT buy a tickets if ticket count is lower than requested', async () => {
        await expectRevert(eventOrganizer.buyTicket(1, 3, {value: 15}), 'Not enough tickets.');
    });

    it('Should buy tickets', async () => {
        await eventOrganizer.buyTicket(1, 1, {value: 5, from: accounts[1]});
        await eventOrganizer.buyTicket(1, 1, {value: 5, from: accounts[2]});
        const ticketCount1 = await eventOrganizer.tickets.call(accounts[1], 1);
        const ticketCount2 = await eventOrganizer.tickets.call(accounts[2], 1);
        assert(ticketCount1.toNumber() === 1);
        assert(ticketCount2.toNumber() === 1);
    });

    it('Should NOT transfer ticket it not enough tickets', async () => {
        await expectRevert(eventOrganizer.transferTicket(1, 3, accounts[5]), 'Not enough tickets to transfer.');
    });

    it('Should transfer ticket', async () => {
        await eventOrganizer.transferTicket(1, 1, accounts[5], {from: accounts[1]});
        const ticketCount1 = await eventOrganizer.tickets.call(accounts[1], 1);
        const ticketCount5 = await eventOrganizer.tickets.call(accounts[5], 1);
        assert(ticketCount1.toNumber() === 0);
        assert(ticketCount5.toNumber() === 1);
    });

    it('Should NOT buy a ticket if event has expired', async () => {
        time.increase(1001);
        await expectRevert(eventOrganizer.buyTicket(1, 1), 'Event is not active anymore.');
      });
  });
});