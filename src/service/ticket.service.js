const Ticket = require('../model/Ticket');

const createTicketService = async (ticketData) => {
    if (!ticketData?.user || !ticketData?.product || !ticketData?.issue) {
        throw new Error('Dados do ticket incompletos');
    }

    const newTicket = new Ticket(ticketData);
    return await newTicket.save();
}

const getAllTicketsService = async () => {
    return await Ticket.find().populate('user', 'name email').populate('product', 'name');
}

const findTicketByIdService = async (id) => {
    if (!id) {
        throw new Error('ID do ticket é obrigatório');
    }
    const ticket = await Ticket.findById(id).populate('user', 'name email').populate('product', 'name');
    if (!ticket) {
        throw new Error('Ticket não encontrado');
    }
    return ticket;
}

const updateTicketService = async (id, ticketData) => {
    if (!id || !ticketData) {
        throw new Error('ID e dados do ticket são obrigatórios');
    }
    const updatedTicket = await Ticket.findByIdAndUpdate(id, ticketData, { new: true });
    if (!updatedTicket) {
        throw new Error('Ticket não encontrado');
    }
    return updatedTicket;
}

const deleteTicketService = async (id) => {
    if (!id) {
        throw new Error('ID do ticket é obrigatório');
    }
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
        throw new Error('Ticket não encontrado');
    }
    return deletedTicket;
}

module.exports = { createTicketService, getAllTicketsService, findTicketByIdService, updateTicketService, deleteTicketService };