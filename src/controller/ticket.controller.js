const ticketService = require('../service/ticket.service');

const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicketService(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getAllTicketsService();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.findTicketByIdService(req.params.id);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const updateTicket = async (req, res) => {
    try {
        const updatedTicket = await ticketService.updateTicketService(req.params.id, req.body);
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTicket = async (req, res) => {
    try {
        await ticketService.deleteTicketService(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket };